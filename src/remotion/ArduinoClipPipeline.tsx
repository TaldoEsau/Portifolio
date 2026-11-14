import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import type { DiagramProps } from "@/remotion/diagram-props";
import { getPalette, type RemotionPalette } from "@/remotion/palette";

export const ARDUINO_FRAMES = 180;

const LABELS = ["ARDUINO", "SERIAL", "PYTHON", "HELIX", "YT-DLP", "FFMPEG 9:16"];

const FALLBACK_STEPS = [
  "Botão físico na mesa",
  "Pulso via cabo USB",
  "Script escuta a porta",
  "API da Twitch cria o clip",
  "Baixa o vídeo do clip",
  "Corta e renderiza vertical",
];

const MONO = "ui-monospace, monospace";
const LEFT = 32;
const CARD_W = 136;
const CARD_GAP = 16;
const CARD_TOP = 72;
const CARD_H = 206;
const ICON = 72;

const center = (index: number) => LEFT + index * (CARD_W + CARD_GAP) + CARD_W / 2;

type IconProps = { color: string; frame: number; active: boolean; palette: RemotionPalette };

function ArduinoIcon({ color, frame, palette }: IconProps) {
  const pressed = frame < 24 ? 4 : 0;
  const ring = interpolate(frame, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 72 72" fill="none">
      {/* placa */}
      <rect x="6" y="30" width="60" height="34" rx="3" stroke={color} strokeWidth="2" />
      <rect x="26" y="40" width="20" height="14" stroke={color} strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <line key={i} x1={12 + i * 8} y1="64" x2={12 + i * 8} y2="68" stroke={color} strokeWidth="1.5" />
      ))}
      <circle cx="14" cy="38" r="2" fill={color} />
      {/* botão arcade */}
      <rect x="28" y={22 + pressed} width="16" height={8 - pressed} fill={color} opacity="0.5" />
      <ellipse cx="36" cy={20 + pressed} rx="12" ry="5" fill={palette.amber} />
      {ring < 1 ? (
        <circle cx="36" cy="18" r={8 + ring * 14} stroke={palette.amber} strokeWidth="1.5" opacity={1 - ring} />
      ) : null}
    </svg>
  );
}

function SerialIcon({ color, frame, active }: IconProps) {
  const shift = active ? (frame * 2) % 24 : 0;
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 72 72" fill="none">
      <rect x="4" y="28" width="16" height="16" stroke={color} strokeWidth="2" />
      <rect x="20" y="32" width="8" height="8" fill={color} />
      <path d="M28 36 H44" stroke={color} strokeWidth="2" />
      <rect x="44" y="30" width="10" height="12" stroke={color} strokeWidth="2" />
      <rect x="54" y="33" width="12" height="6" fill={color} />
      <text x={6 + shift} y="20" fill={color} fontFamily={MONO} fontSize="10">
        0101
      </text>
      <text x={30 - shift} y="60" fill={color} fontFamily={MONO} fontSize="10" opacity="0.6">
        1100
      </text>
    </svg>
  );
}

function PythonIcon({ color, frame, active }: IconProps) {
  const blink = active && Math.floor(frame / 8) % 2 === 0;
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 72 72" fill="none">
      <rect x="4" y="10" width="64" height="52" rx="3" stroke={color} strokeWidth="2" />
      <path d="M4 20 H68" stroke={color} strokeWidth="1.5" />
      <circle cx="10" cy="15" r="1.8" fill={color} />
      <circle cx="16" cy="15" r="1.8" fill={color} />
      <circle cx="22" cy="15" r="1.8" fill={color} />
      <path d="M12 30 L18 35 L12 40" stroke={color} strokeWidth="2" />
      <path d="M22 41 H34" stroke={color} strokeWidth="2" opacity={blink ? 1 : 0.2} />
      <path d="M12 48 H50" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <path d="M12 54 H40" stroke={color} strokeWidth="1.5" opacity="0.5" />
    </svg>
  );
}

function HelixIcon({ color, active, frame, palette }: IconProps) {
  const rec = active && Math.floor(frame / 10) % 2 === 0;
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 72 72" fill="none">
      {/* balão de chat / live */}
      <path d="M8 10 H64 V48 H40 L28 60 V48 H8 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {/* tesoura do clip */}
      <circle cx="26" cy="36" r="5" stroke={color} strokeWidth="2" />
      <circle cx="26" cy="22" r="5" stroke={color} strokeWidth="2" />
      <path d="M30 33 L52 20 M30 25 L52 38" stroke={color} strokeWidth="2" />
      <circle cx="58" cy="16" r="3" fill={rec ? palette.amber : "transparent"} />
    </svg>
  );
}

function DownloadIcon({ color, frame, active }: IconProps) {
  const drop = active ? (frame % 20) / 2 : 0;
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 72 72" fill="none">
      <g transform={`translate(0 ${drop - 4})`}>
        <path d="M36 8 V38" stroke={color} strokeWidth="3" />
        <path d="M24 28 L36 40 L48 28" stroke={color} strokeWidth="3" strokeLinejoin="round" />
      </g>
      <path d="M10 46 V62 H62 V46" stroke={color} strokeWidth="2" />
      <rect x="18" y="52" width="36" height="5" fill={color} opacity="0.5" />
    </svg>
  );
}

function RenderIcon({ color }: IconProps) {
  return (
    <svg width={ICON} height={ICON} viewBox="0 0 72 72" fill="none">
      {/* quadro 16:9 */}
      <rect x="2" y="24" width="34" height="20" stroke={color} strokeWidth="1.5" opacity="0.6" />
      <path d="M38 34 H44 M41 31 L44 34 L41 37" stroke={color} strokeWidth="1.5" />
      {/* celular 9:16 */}
      <rect x="48" y="6" width="22" height="60" rx="3" stroke={color} strokeWidth="2" />
      <rect x="51" y="12" width="16" height="16" fill={color} opacity="0.4" />
      <rect x="51" y="31" width="16" height="28" fill={color} opacity="0.7" />
    </svg>
  );
}

const ICONS = [ArduinoIcon, SerialIcon, PythonIcon, HelixIcon, DownloadIcon, RenderIcon];

/** Cena de live simplificada: jogo + webcam. */
function LiveScene({ width, height, palette }: { width: number; height: number; palette: RemotionPalette }) {
  return (
    <svg width={width} height={height} viewBox="0 0 160 90" preserveAspectRatio="none">
      <rect width="160" height="90" fill={palette.panel} />
      <path d="M0 70 L30 55 L55 64 L85 42 L115 58 L160 40 V90 H0 Z" fill={palette.line} opacity="0.7" />
      <circle cx="78" cy="50" r="5" fill={palette.amber} />
      <rect x="120" y="6" width="34" height="24" fill={palette.voidColor} stroke={palette.holo} strokeWidth="1" />
      <circle cx="137" cy="15" r="4" fill={palette.holo} />
      <path d="M129 28 Q137 19 145 28" fill={palette.holo} />
    </svg>
  );
}

export function ArduinoClipPipeline({ caption = "", steps, side = "dark" }: DiagramProps) {
  const palette = getPalette(side);
  const { amber, holo, ink, line, muted, ok, panel, voidColor } = palette;

  const frame = useCurrentFrame();
  const descriptions = steps && steps.length === LABELS.length ? steps : FALLBACK_STEPS;

  const dotX = interpolate(frame, [16, 140], [center(0), center(LABELS.length - 1)], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const step = LABELS.reduce((acc, _, index) => (center(index) <= dotX + 1 ? index : acc), 0);

  /* Corte final: janela 9:16 desliza sobre o quadro da live */
  const LIVE_W = 288;
  const LIVE_H = 162;
  const CROP_W = Math.round((LIVE_H * 9) / 16);
  const cropX = interpolate(frame, [140, 165], [0, LIVE_W - CROP_W - 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finalShow = interpolate(frame, [150, 172], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cropShow = step >= LABELS.length - 1 ? 1 : 0.15;

  const lineY = CARD_TOP + 14 + ICON / 2;

  return (
    <AbsoluteFill style={{ background: voidColor }}>
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: 26,
          color: amber,
          fontFamily: MONO,
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        STREAM LAB // CLIP BUTTON
      </div>

      {/* trilha de conexão + pulso */}
      <svg
        width={960}
        height={540}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      >
        <line
          x1={center(0)}
          y1={lineY}
          x2={center(LABELS.length - 1)}
          y2={lineY}
          stroke={line}
          strokeWidth="2"
          strokeDasharray="6 6"
        />
        <line x1={center(0)} y1={lineY} x2={dotX} y2={lineY} stroke={holo} strokeWidth="2" />
        <circle cx={dotX} cy={lineY} r="7" fill={amber} />
        <circle cx={dotX} cy={lineY} r="13" fill="none" stroke={amber} strokeWidth="1.5" opacity="0.5" />
      </svg>

      {LABELS.map((label, index) => {
        const Icon = ICONS[index]!;
        const reached = index <= step;
        const current = index === step;
        const color = current ? amber : reached ? holo : muted;
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: LEFT + index * (CARD_W + CARD_GAP),
              top: CARD_TOP,
              width: CARD_W,
              height: CARD_H,
              border: `1px solid ${current ? amber : reached ? holo : line}`,
              background: panel,
              boxSizing: "border-box",
              padding: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              opacity: reached ? 1 : 0.55,
              borderRadius: side === "light" ? 8 : 0,
            }}
          >
            <div
              style={{
                width: ICON + 8,
                height: ICON + 8,
                background: voidColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: side === "light" ? 6 : 0,
              }}
            >
              <Icon color={color} frame={frame} active={current} palette={palette} />
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 13,
                fontWeight: 700,
                color: reached ? ink : muted,
                marginTop: 6,
              }}
            >
              {String(index + 1).padStart(2, "0")} {label}
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 12,
                lineHeight: 1.35,
                color: muted,
                textAlign: "center",
              }}
            >
              {descriptions[index]}
            </div>
          </div>
        );
      })}

      {/* Antes: quadro 16:9 da live com janela de corte */}
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: 330,
          fontFamily: MONO,
          fontSize: 12,
          color: muted,
        }}
      >
        LIVE 16:9
      </div>
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: 350,
          width: LIVE_W,
          height: LIVE_H,
          border: `1px solid ${line}`,
          overflow: "hidden",
          borderRadius: side === "light" ? 6 : 0,
        }}
      >
        <LiveScene width={LIVE_W} height={LIVE_H} palette={palette} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: cropX,
            width: CROP_W,
            height: LIVE_H,
            border: `2px solid ${ok}`,
            boxSizing: "border-box",
            boxShadow: `0 0 0 999px rgba(0,0,0,${0.45 * cropShow})`,
            opacity: cropShow,
          }}
        />
      </div>

      {/* seta */}
      <svg width={70} height={40} style={{ position: "absolute", left: LEFT + LIVE_W + 14, top: 412 }}>
        <path
          d="M4 20 H58 M48 10 L60 20 L48 30"
          stroke={finalShow > 0 ? ok : line}
          strokeWidth="2.5"
          fill="none"
        />
      </svg>

      {/* Depois: celular 9:16 */}
      <div
        style={{
          position: "absolute",
          left: 422,
          top: 330,
          fontFamily: MONO,
          fontSize: 12,
          color: muted,
        }}
      >
        CLIP 9:16
      </div>
      <div
        style={{
          position: "absolute",
          left: 422,
          top: 350,
          width: 104,
          height: 180,
          border: `2px solid ${finalShow > 0 ? ok : line}`,
          borderRadius: 12,
          boxSizing: "border-box",
          padding: 6,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          background: voidColor,
        }}
      >
        <div
          style={{
            height: 56,
            background: panel,
            border: `1px solid ${holo}`,
            opacity: finalShow,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36">
            <circle cx="18" cy="13" r="7" fill={holo} />
            <path d="M5 34 Q18 18 31 34" fill={holo} />
          </svg>
        </div>
        <div style={{ flex: 1, overflow: "hidden", opacity: finalShow, borderRadius: 6 }}>
          <svg width="100%" height="100%" viewBox="0 0 40 70" preserveAspectRatio="none">
            <rect width="40" height="70" fill={panel} />
            <path d="M0 52 L12 40 L24 48 L40 32 V70 H0 Z" fill={line} />
            <circle cx="20" cy="38" r="4" fill={amber} />
          </svg>
        </div>
      </div>

      {/* legenda */}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 380,
          width: 368,
          color: ink,
          fontFamily: MONO,
          fontSize: 16,
          lineHeight: 1.45,
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
}
