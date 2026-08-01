import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon généré : le « 1 » de la Ligue 1, sur le rouge du drapeau. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e70013",
          color: "#fff",
          fontSize: 46,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        1
      </div>
    ),
    size,
  );
}
