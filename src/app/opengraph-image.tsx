import { ImageResponse } from "next/og";

export const alt = "Elijah Cortez — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const KNIGHT = String.raw`
      ,^.
     (|||)
   __|===|__
  /  | | |  \
 |   |_|_|   |
 |  /|-+-|\  |
  \/ |   | \/
     |   |
    /|   |\
     |   |
      \ /
       V`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#050505",
          color: "#d0ccc4",
          padding: 64,
          border: "1px solid #2a2a2a",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <div style={{ fontSize: 22, letterSpacing: 8, color: "#8b8882" }}>FOLIO · MMXXVI</div>
          <div style={{ fontSize: 104, marginTop: 24, color: "#ebe6dc", lineHeight: 1 }}>Elijah Cortez</div>
          <div style={{ fontSize: 28, marginTop: 28, letterSpacing: 10 }}>SOFTWARE ENGINEER / DESIGNER / BUILDER</div>
          <div style={{ fontSize: 26, marginTop: 40, color: "#b89b5e" }}>
            CSUN Senior Project Showcase — 1st Place, 2026
          </div>
        </div>
        <div style={{ display: "flex", whiteSpace: "pre", fontFamily: "monospace", fontSize: 30, lineHeight: 1.15, color: "#d0ccc4", alignItems: "center" }}>
          {KNIGHT}
        </div>
      </div>
    ),
    size,
  );
}
