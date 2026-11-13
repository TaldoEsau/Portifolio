import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#07080A",
          color: "#FF9F1C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          border: "2px solid #FF9F1C",
        }}
      >
        +
      </div>
    ),
    size,
  );
}
