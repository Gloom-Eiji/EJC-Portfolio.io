// Turn-based logic for "The Gauntlet". Pure functions: given a state and an
// action, return the next state. Randomness comes from Math.random, called
// from event handlers (never inside a React updater).

export type EnemyKind = "goblin" | "kobold" | "mage" | "dragon";
export type Action = "attack" | "defend" | "heal";
export type Phase = "choose" | "round-won" | "victory" | "defeat";

type EnemyDef = {
  name: string;
  epithet: string;
  hp: number;
  dmg: [number, number];
  trait: string;
};

export const ENEMIES: Record<EnemyKind, EnemyDef> = {
  goblin: { name: "Goblin", epithet: "Cutpurse of the Low Roads", hp: 18, dmg: [3, 6], trait: "Frenzied: sometimes strikes twice." },
  kobold: { name: "Kobold", epithet: "Tunnel Skulker", hp: 20, dmg: [2, 5], trait: "Slippery: may dodge your blade." },
  mage: { name: "Hedge Mage", epithet: "Keeper of Small Curses", hp: 15, dmg: [4, 7], trait: "Arcane: spells slip past a raised shield, and hexes weaken you." },
  dragon: { name: "Ashen Wyrm", epithet: "The Last Gate", hp: 64, dmg: [5, 8], trait: "Draws breath before it burns, so defend when it inhales. Enraged when wounded." },
};

export const PLAYER_MAX = 34;
export const FLASKS = 3;
export const ROUNDS = 4; // three skirmishes, then the dragon

export type Fx = { id: number; target: "player" | "enemy"; text: string; tone: "hit" | "heal" | "block" | "miss" | "crit" };

export type BattleState = {
  round: number;
  phase: Phase;
  player: { hp: number; flasks: number; guarding: boolean; riposte: boolean; hexed: boolean };
  enemy: { kind: EnemyKind; hp: number; max: number; charging: boolean; enraged: boolean; turns: number };
  log: string[];
  fx: Fx[];
  seq: number;
};

const rand = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const chance = (p: number) => Math.random() < p;

function spawn(round: number, prev?: EnemyKind): BattleState["enemy"] {
  let kind: EnemyKind;
  if (round >= ROUNDS) kind = "dragon";
  else {
    const pool: EnemyKind[] = ["goblin", "kobold", "mage"];
    const options = pool.filter((k) => k !== prev);
    kind = options[rand(0, options.length - 1)];
  }
  const max = ENEMIES[kind].hp;
  return { kind, hp: max, max, charging: false, enraged: false, turns: 0 };
}

export function newBattle(): BattleState {
  const enemy = spawn(1);
  return {
    round: 1,
    phase: "choose",
    player: { hp: PLAYER_MAX, flasks: FLASKS, guarding: false, riposte: false, hexed: false },
    enemy,
    log: [`A ${ENEMIES[enemy.kind].name} bars the road. ${ENEMIES[enemy.kind].trait}`],
    fx: [],
    seq: 0,
  };
}

export function act(s: BattleState, action: Action): BattleState {
  if (s.phase !== "choose") return s;
  const p = { ...s.player };
  const e = { ...s.enemy };
  const def = ENEMIES[e.kind];
  const log: string[] = [];
  const fx: Fx[] = [];
  let seq = s.seq;
  const push = (f: Omit<Fx, "id">) => fx.push({ ...f, id: ++seq });

  // ---- Your move ----
  p.guarding = false;
  if (action === "attack") {
    let dmg = rand(5, 9) + (p.riposte ? 4 : 0);
    const crit = chance(0.15);
    if (crit) dmg *= 2;
    if (p.hexed) dmg = Math.ceil(dmg / 2);
    if (e.kind === "kobold" && chance(0.3)) {
      log.push("The kobold scuttles aside. Your blade bites only air.");
      push({ target: "enemy", text: "miss", tone: "miss" });
    } else {
      e.hp = Math.max(0, e.hp - dmg);
      log.push(
        `${crit ? "A critical blow! " : ""}${p.riposte ? "Riposte! " : ""}You strike the ${def.name} for ${dmg}.${p.hexed ? " (hexed: halved)" : ""}`,
      );
      push({ target: "enemy", text: `-${dmg}`, tone: crit ? "crit" : "hit" });
    }
    p.riposte = false;
    p.hexed = false;
  } else if (action === "defend") {
    p.guarding = true;
    p.riposte = true;
    log.push("You raise your shield and wait for an opening.");
  } else {
    if (p.flasks <= 0) {
      log.push("Your flasks are empty. You waste a breath fumbling for one.");
    } else {
      const amt = Math.min(PLAYER_MAX - p.hp, rand(9, 13));
      p.hp += amt;
      p.flasks -= 1;
      log.push(`You drink a crimson flask: +${amt} HP. (${p.flasks} left)`);
      push({ target: "player", text: `+${amt}`, tone: "heal" });
    }
  }

  // ---- Enemy falls? ----
  if (e.hp <= 0) {
    const last = s.round >= ROUNDS;
    log.push(last ? "The Ashen Wyrm crashes down. The gate is open." : `The ${def.name} falls.`);
    return finish(s, { ...s, player: p, enemy: e, phase: last ? "victory" : "round-won", fx, seq }, log);
  }

  // ---- Enemy move ----
  e.turns += 1;
  const hit = (base: number, label: string, pierce = 0.7) => {
    let dmg = base + (e.enraged ? 2 : 0);
    if (p.guarding) {
      const blocked = Math.round(dmg * pierce);
      dmg -= blocked;
      push({ target: "player", text: dmg > 0 ? `-${dmg}` : "block", tone: dmg > 0 ? "hit" : "block" });
      log.push(`${label} Your shield absorbs ${blocked}${dmg > 0 ?  `, you take ${dmg}` : ""}.`);
    } else {
      push({ target: "player", text: `-${dmg}`, tone: "hit" });
      log.push(`${label} You take ${dmg}.`);
    }
    p.hp = Math.max(0, p.hp - dmg);
  };

  switch (e.kind) {
    case "goblin": {
      hit(rand(...def.dmg), "The goblin slashes.");
      if (chance(0.25) && p.hp > 0) hit(rand(2, 4), "In a frenzy, it slashes again!");
      break;
    }
    case "kobold": {
      hit(rand(...def.dmg), "The kobold jabs with a rusted spear.");
      break;
    }
    case "mage": {
      if (chance(0.3)) {
        p.hexed = true;
        log.push("The mage mutters a hex. Your next strike will be weakened.");
        hit(rand(2, 3), "Sparks sting you.", 0.4);
      } else {
        hit(rand(...def.dmg), "A bolt of violet fire lances out.", 0.4);
      }
      break;
    }
    case "dragon": {
      if (!e.enraged && e.hp <= e.max / 2) {
        e.enraged = true;
        log.push("The wyrm roars, scales glowing like coals. It is enraged!");
      }
      if (e.charging) {
        e.charging = false;
        hit(rand(15, 19), "FIRE BREATH engulfs the field!", 0.85);
      } else if (e.turns % 3 === 0 || chance(e.enraged ? 0.45 : 0.3)) {
        e.charging = true;
        log.push("The wyrm rears back and draws a deep, rumbling breath…");
      } else if (chance(0.3)) {
        hit(rand(3, 5), "Its tail sweeps low.");
        if (p.hp > 0) hit(rand(3, 5), "Then the claws follow.");
      } else {
        hit(rand(...def.dmg), "The wyrm rakes you with its claws.");
      }
      break;
    }
  }

  if (p.hp <= 0) log.push("You fall. The road claims another knight.");
  return finish(s, { ...s, player: p, enemy: e, phase: p.hp <= 0 ? "defeat" : "choose", fx, seq }, log);
}

/** Advance to the next round after a win: a short rest, then a new foe. */
export function nextRound(s: BattleState): BattleState {
  if (s.phase !== "round-won") return s;
  const round = s.round + 1;
  const enemy = spawn(round, s.enemy.kind);
  const rest = Math.min(PLAYER_MAX - s.player.hp, 8);
  const def = ENEMIES[enemy.kind];
  const intro =
    enemy.kind === "dragon"
      ? `The ground shakes. The ${def.name}, ${def.epithet}, descends. ${def.trait}`
      : `A ${def.name} steps from the shadows. ${def.trait}`;
  return {
    ...s,
    round,
    phase: "choose",
    enemy,
    player: { ...s.player, hp: s.player.hp + rest, guarding: false, riposte: false, hexed: false },
    log: [...s.log, `You rest and bind your wounds: +${rest} HP.`, intro].slice(-7),
    fx: [],
  };
}

function finish(_prev: BattleState, next: BattleState, lines: string[]): BattleState {
  return { ...next, log: [...next.log, ...lines].slice(-7) };
}

// ---- ASCII sprites (knight faces right, foes face left) ----

export const KNIGHT = String.raw`
     _,_
    [=_=]     /
   __|_|__   /
  /| ### |\_/
 ( | ### |
   |_____|
   /  |  \
  /_  |  _\ `;

export const SPRITES: Record<EnemyKind, string> = {
  goblin: String.raw`
    ,      ,
    /\(oo)/\
      (vv)
  |--/|##|\
     /  \
    ^    ^`,
  kobold: String.raw`
    /\_/\
  <( o.o )
     \^/
 o--/|=|\
    /   \
   '     '`,
  mage: String.raw`
       /\
   *  /  \
   | /____\
   | (o.o)
   +-/|~~|\
     /____\ `,
  dragon: String.raw`
       __          /\      /\
   ___/ o\__      /  \____/  \
  <___   ___\____/            \___
    vv \/    \                 ___>
             /  /\____/\  /\  \
            /__/       /__/ \__\ `,
};

export const FIRE = String.raw`~~<<~~<<~~`;
