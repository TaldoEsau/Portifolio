"use client"

import { useCallback, useMemo, useRef, useState } from "react"

import { useSmilPause } from "@/hooks/useSmilPause"

import { cn } from "@/lib/utils"

export type DeployStatus = "deploying" | "deployed" | "error"
export type TrajectoryStep = [number, number]
export type BuiltInNodeIcon =
  | "triangle"
  | "server"
  | "database"
  | "globe"
  | "shield"
  | "zap"
  | "cloud"
  | "hexagon"
export type CustomNodeIcon = { d: string; viewBox?: string }
export type NodeIcon = BuiltInNodeIcon | CustomNodeIcon
export type DeployNode = {
  id: string
  trajectory: TrajectoryStep[]
  icon?: NodeIcon
}

export type DeployNodeData = DeployNode & {
  pathD: string
  waypoints: { x: number; y: number }[]
  endPt: { x: number; y: number }
}

export type DeployGlobeProps = {
  status?: DeployStatus
  nodes?: DeployNode[]
  accentColor?: string
  duration?: number
  className?: string
  onReplay?: () => void
  statusLabel: string
  replayLabel: string
}

const MERIDIANS = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const ICON_PATHS: Record<BuiltInNodeIcon, string> = {
  triangle: "M8 1L15 14H1L8 1Z",
  server:
    "M2 3a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm0 6a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V9zm9-5.5a.75.75 0 100-1.5.75.75 0 000 1.5zM11 10.5a.75.75 0 100-1.5.75.75 0 000 1.5z",
  database:
    "M8 1C4.13 1 1 2.34 1 4v8c0 1.66 3.13 3 7 3s7-1.34 7-3V4c0-1.66-3.13-3-7-3zm0 2c3.31 0 5 .9 5 1s-1.69 1-5 1-5-.9-5-1 1.69-1 5-1zm5 9c0 .1-1.69 1-5 1s-5-.9-5-1V9.47C4.55 10.06 6.15 10.5 8 10.5s3.45-.44 5-1.03V12zm0-4c0 .1-1.69 1-5 1s-5-.9-5-1V5.47C4.55 6.06 6.15 6.5 8 6.5s3.45-.44 5-1.03V8z",
  globe:
    "M8 1a7 7 0 100 14A7 7 0 008 1zM6.53 2.66A5.5 5.5 0 002.6 7H5.1c.1-1.62.4-3.07.86-4.13a5.52 5.52 0 01.57-.21zm2.94 0c.2.06.39.13.57.21.46 1.06.76 2.51.87 4.13h2.49a5.5 5.5 0 00-3.93-4.34zM6.6 7c.1-1.46.38-2.73.77-3.6.26-.58.52-.9.63-.9.11 0 .37.32.63.9.39.87.67 2.14.77 3.6H6.6zm-4 2a5.5 5.5 0 003.93 4.34 5.43 5.43 0 01-.57-.21C5.5 12.07 5.2 10.62 5.1 9H2.6zm6.87 4.34A5.5 5.5 0 0013.4 9h-2.49c-.1 1.62-.41 3.07-.87 4.13.18-.06.37-.13.57-.21h-.24zM6.6 9c.1 1.46.38 2.73.77 3.6.26.58.52.9.63.9.11 0 .37-.32.63-.9.39-.87.67-2.14.77-3.6H6.6z",
  shield:
    "M8 1L2 4v4c0 3.33 2.56 6.44 6 7.15C11.44 14.44 14 11.33 14 8V4L8 1zm0 2.18L12 5.4v2.6c0 2.52-1.77 4.86-4 5.55-2.23-.69-4-3.03-4-5.55V5.4L8 3.18z",
  zap: "M8.94 1.5L3 9h4.5l-.44 5.5L13 7H8.5l.44-5.5z",
  cloud:
    "M12.5 6.5A4.5 4.5 0 004 7.08 3.5 3.5 0 003.5 14h9a3 3 0 000-6 4.47 4.47 0 000-1.5zM8 4a3 3 0 00-2.83 2.02l-.23.67-.7.1A2 2 0 005.5 12.5h7a1.5 1.5 0 000-3h-.73l-.12-.72A3 3 0 008 4z",
  hexagon:
    "M8 1.5L14 5v6l-6 3.5L2 11V5l6-3.5zm0 1.73L3.5 6.04v4.92L8 13.77l4.5-2.81V6.04L8 3.23z",
}

export const DEFAULT_NODES: DeployNode[] = [
  {
    id: "n1",
    trajectory: [
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
    ],
  },
  {
    id: "n2",
    trajectory: [
      [-3, 0],
      [-3, 1],
      [-3, 2],
      [-3, 3],
      [-3, 4],
    ],
  },
  {
    id: "n3",
    trajectory: [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
  },
  {
    id: "n4",
    trajectory: [
      [-1, 0],
      [-1, 1],
      [-2, 1],
    ],
  },
  {
    id: "n5",
    trajectory: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
      [-1, 3],
    ],
  },
  {
    id: "n6",
    trajectory: [
      [2, 0],
      [2, 1],
    ],
  },
]

function meridianA(index: number, radius: number) {
  return (
    radius * Math.sin((Math.abs(index) / 4) * (Math.PI / 2)) * Math.sign(index)
  )
}

function rowY(row: number, cy: number, radius: number) {
  return cy - radius + row * ((2 * radius) / 10)
}

function pointOnMeridian(
  mIdx: number,
  row: number,
  cx: number,
  cy: number,
  radius: number
) {
  const a = meridianA(mIdx, radius)
  const y = rowY(row, cy, radius)
  const t = (y - cy) / radius
  const xOff = Math.abs(a) * Math.sqrt(Math.max(0, 1 - t * t))
  return { x: cx + (a >= 0 ? xOff : -xOff), y }
}

function horizontalSpan(row: number, cx: number, cy: number, radius: number) {
  const y = rowY(row, cy, radius)
  const t = (y - cy) / radius
  const half = radius * Math.sqrt(Math.max(0, 1 - t * t))
  return { x1: cx - half, x2: cx + half, y }
}

function buildPathData(
  trajectory: TrajectoryStep[],
  cx: number,
  cy: number,
  radius: number
) {
  const northPole = { x: cx, y: cy - radius }
  const points = trajectory.map(([m, row]) =>
    pointOnMeridian(m, row, cx, cy, radius)
  )
  const allPoints = [northPole, ...points]
  const parts = [`M ${northPole.x.toFixed(2)} ${northPole.y.toFixed(2)}`]

  for (let index = 1; index < allPoints.length; index++) {
    const point = allPoints[index]

    if (index === 1) {
      const m = trajectory[0][0]
      const a = Math.abs(meridianA(m, radius))
      const sweep = m >= 0 ? 1 : 0
      if (a < 0.5) {
        parts.push(`L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      } else {
        parts.push(
          `A ${a.toFixed(2)} ${radius} 0 0 ${sweep} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
        )
      }
    } else {
      const [prevM, prevRow] = trajectory[index - 2]
      const [currentM, currentRow] = trajectory[index - 1]

      if (currentM === prevM) {
        const a = Math.abs(meridianA(currentM, radius))
        const sweep =
          currentM >= 0
            ? currentRow > prevRow
              ? 1
              : 0
            : currentRow > prevRow
              ? 0
              : 1
        if (a < 0.5) {
          parts.push(`L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
        } else {
          parts.push(
            `A ${a.toFixed(2)} ${radius} 0 0 ${sweep} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
          )
        }
      } else {
        parts.push(`L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      }
    }
  }

  return { d: parts.join(" "), waypoints: allPoints }
}

function GlobeWireframe({
  cx,
  cy,
  radius,
  wireColor,
}: {
  cx: number
  cy: number
  radius: number
  wireColor: string
}) {
  return (
    <g data-slot="deploy-globe-wireframe" opacity="0.75">
      <circle
        cx={cx}
        cy={cy}
        fill="none"
        r={radius}
        stroke={wireColor}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      {MERIDIANS.map((m) => {
        const a = Math.abs(meridianA(m, radius))
        const dir = m >= 0 ? 1 : 0
        return (
          <path
            d={`M ${cx} ${cy + radius} A ${a.toFixed(3)} ${radius} 0 0 ${dir} ${cx} ${cy - radius}`}
            fill="none"
            key={`m${m}`}
            stroke={wireColor}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        )
      })}
      {ROWS.map((row) => {
        const { x1, x2, y } = horizontalSpan(row, cx, cy, radius)
        return (
          <line
            key={`r${row}`}
            stroke={wireColor}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            x1={x1.toFixed(2)}
            x2={x2.toFixed(2)}
            y1={y.toFixed(2)}
            y2={y.toFixed(2)}
          />
        )
      })}
    </g>
  )
}

function DeployPath({
  pathD,
  waypoints,
  accent,
  duration,
  id,
}: {
  pathD: string
  waypoints: { x: number; y: number }[]
  accent: string
  duration: number
  id: string
}) {
  const waypointCount = waypoints.length
  const totalPhases = waypointCount + 3
  const keyTimes = Array.from({ length: totalPhases + 1 }, (_, index) =>
    (index / totalPhases).toFixed(4)
  )
  const keyTimesStr = keyTimes.join(";")

  const cxValues: string[] = []
  const cyValues: string[] = []
  const radiusValues: string[] = []
  const opacityValues: string[] = []

  const first = waypoints[0]
  const last = waypoints[waypointCount - 1]

  for (let index = 0; index <= totalPhases; index++) {
    if (index === 0) {
      cxValues.push(first.x.toFixed(1))
      cyValues.push(first.y.toFixed(1))
      radiusValues.push("0")
      opacityValues.push("0")
    } else if (index <= waypointCount) {
      const point = waypoints[index - 1]
      cxValues.push(point.x.toFixed(1))
      cyValues.push(point.y.toFixed(1))
      radiusValues.push("140")
      opacityValues.push("1")
    } else if (index === waypointCount + 1) {
      cxValues.push(last.x.toFixed(1))
      cyValues.push(last.y.toFixed(1))
      radiusValues.push("140")
      opacityValues.push("1")
    } else if (index === waypointCount + 2) {
      cxValues.push(last.x.toFixed(1))
      cyValues.push(last.y.toFixed(1))
      radiusValues.push("0")
      opacityValues.push("0")
    } else {
      cxValues.push(first.x.toFixed(1))
      cyValues.push(first.y.toFixed(1))
      radiusValues.push("0")
      opacityValues.push("0")
    }
  }

  const gradientId = `dg-${id}`

  return (
    <g data-slot="deploy-globe-path">
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      >
        <animate
          attributeName="opacity"
          dur={`${duration}s`}
          keyTimes={keyTimesStr}
          repeatCount="indefinite"
          values={opacityValues.join(";")}
        />
      </path>
      <defs>
        <radialGradient
          cx={first.x}
          cy={first.y}
          gradientUnits="userSpaceOnUse"
          id={gradientId}
          r="0"
        >
          <stop offset="0" stopColor={accent} />
          <stop offset="0.4" stopColor={accent} />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
          <animate
            attributeName="cx"
            dur={`${duration}s`}
            keyTimes={keyTimesStr}
            repeatCount="indefinite"
            values={cxValues.join(";")}
          />
          <animate
            attributeName="cy"
            dur={`${duration}s`}
            keyTimes={keyTimesStr}
            repeatCount="indefinite"
            values={cyValues.join(";")}
          />
          <animate
            attributeName="r"
            dur={`${duration}s`}
            keyTimes={keyTimesStr}
            repeatCount="indefinite"
            values={radiusValues.join(";")}
          />
        </radialGradient>
      </defs>
    </g>
  )
}

function NodeMarker({
  x,
  y,
  accent,
  wireColor,
  duration,
  waypointCount,
  icon,
}: {
  x: number
  y: number
  accent: string
  wireColor: string
  duration: number
  waypointCount: number
  icon?: NodeIcon
}) {
  const totalPhases = waypointCount + 3
  const arrivalFraction = waypointCount / totalPhases
  const p1 = arrivalFraction
  const p2 = Math.min(p1 + 0.06, 0.97)
  const p3 = Math.min(p1 + 0.12, 0.98)
  const p4 = Math.min(p1 + 0.2, 0.99)
  const keyTimes = `0;${p1.toFixed(4)};${p2.toFixed(4)};${p3.toFixed(4)};${p4.toFixed(4)};1`
  const hasIcon = icon != null

  let iconPath: string | null = null
  let iconViewBox = "0 0 16 16"

  if (hasIcon) {
    if (typeof icon === "string") {
      iconPath = ICON_PATHS[icon]
    } else {
      iconPath = icon.d
      iconViewBox = icon.viewBox || iconViewBox
    }
  }

  const [vbX, vbY, vbW, vbH] = iconViewBox.split(" ").map(Number)
  const targetSize = 16
  const scale = targetSize / Math.max(vbW || 16, vbH || 16)
  const offsetX = x - ((vbW || 16) * scale) / 2 - vbX * scale
  const offsetY = y - ((vbH || 16) * scale) / 2 - vbY * scale

  return (
    <g data-slot="deploy-globe-node-marker">
      <circle
        cx={x}
        cy={y}
        fill="none"
        opacity="0"
        r="0"
        stroke={accent}
        strokeWidth="2"
      >
        <animate
          attributeName="r"
          dur={`${duration}s`}
          keyTimes={keyTimes}
          repeatCount="indefinite"
          values="0;0;14;22;28;0"
        />
        <animate
          attributeName="opacity"
          dur={`${duration}s`}
          keyTimes={keyTimes}
          repeatCount="indefinite"
          values="0;0;0.9;0.5;0;0"
        />
      </circle>

      <circle
        cx={x}
        cy={y}
        fill="var(--globe-bg, #fff)"
        r="16"
        stroke={wireColor}
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
      {hasIcon && iconPath ? (
        <path
          clipRule="evenodd"
          d={iconPath}
          fill="var(--globe-dot, #4d4d4d)"
          fillRule="evenodd"
          transform={`translate(${offsetX.toFixed(2)}, ${offsetY.toFixed(2)}) scale(${scale.toFixed(4)})`}
        />
      ) : (
        <circle cx={x} cy={y} fill="var(--globe-dot, #4d4d4d)" r="8" />
      )}
    </g>
  )
}

function DeployGlobeSvg({
  width,
  height,
  children,
}: {
  width: number
  height: number
  children: React.ReactNode
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  useSmilPause(svgRef)

  return (
    <svg
      aria-hidden="true"
      className="h-auto w-full"
      data-slot="deploy-globe-svg"
      ref={svgRef}
      style={{ overflow: "visible", maxWidth: 800 }}
      viewBox={`-1 -1 ${width + 2} ${height + 2}`}
    >
      {children}
    </svg>
  )
}

function DeployGlobeStatusBadge({
  statusLabel,
  replayLabel,
  onReplay,
}: {
  statusLabel: string
  replayLabel: string
  onReplay: () => void
}) {
  return (
    <div
      className="absolute flex select-none items-center overflow-hidden"
      data-slot="deploy-globe-status"
      style={{
        bottom: "6%",
        left: "50%",
        transform: "translateX(-50%)",
        background: "var(--globe-bg, #fff)",
        border: "1px solid var(--globe-wire, #d4d4d4)",
        borderRadius: 0,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ padding: "8px 16px" }}>
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 12,
            letterSpacing: "0.02em",
            color: "var(--globe-dot, #6b7280)",
          }}
        >
          {statusLabel}
        </span>
      </div>
      <button
        aria-label={replayLabel}
        data-slot="deploy-globe-replay"
        onClick={onReplay}
        onMouseEnter={(event) => {
          event.currentTarget.style.background =
            "var(--color-surface-2)"
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.background = "none"
        }}
        style={{
          padding: "8px 12px",
          borderLeft: "1px solid var(--globe-wire, #d4d4d4)",
          background: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          color: "var(--globe-dot, #6b7280)",
          transition: "color 0.15s ease, background 0.15s ease",
        }}
        type="button"
      >
        <svg
          aria-hidden="true"
          fill="currentColor"
          focusable="false"
          height="14"
          viewBox="0 0 16 16"
          width="14"
        >
          <path
            clipRule="evenodd"
            d="M2.5 8C2.5 4.966 4.974 2.5 8.035 2.5c2.537 0 4.671 1.694 5.328 4H10.75V8h4.5a.75.75 0 0 0 .75-.75v-4.5H14.5v2.483C13.422 2.742 10.932 1 8.035 1 4.154 1 1 4.13 1 8s3.154 7 7.035 7c2.34 0 4.416-1.138 5.694-2.888l.443-.606-1.211-.885-.443.606A5.543 5.543 0 0 1 8.035 13.5C4.974 13.5 2.5 11.034 2.5 8Z"
            fillRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

function DeployGlobe({
  status = "deployed",
  nodes = DEFAULT_NODES,
  accentColor,
  duration = 4.5,
  className = "",
  onReplay,
  statusLabel,
  replayLabel,
}: DeployGlobeProps) {
  const [animationKey, setAnimationKey] = useState(0)
  const width = 800
  const height = 400
  const cx = width / 2
  const cy = height
  const radius = height

  const accent =
    status === "error"
      ? "var(--globe-error, #EF4444)"
      : accentColor || "#45DEC4"
  const wireColor = "var(--globe-wire, #c9c9c9)"

  const replay = useCallback(() => {
    setAnimationKey((key) => key + 1)
    onReplay?.()
  }, [onReplay])

  const nodeData = useMemo<DeployNodeData[]>(
    () =>
      nodes.map((node) => {
        const { d, waypoints } = buildPathData(node.trajectory, cx, cy, radius)
        const endPt = waypoints[waypoints.length - 1]
        return { ...node, pathD: d, waypoints, endPt }
      }),
    [nodes, cx, cy, radius]
  )

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center",
        className
      )}
      data-slot="deploy-globe"
      style={
        {
          "--globe-bg": "var(--color-surface)",
          "--globe-dot": "var(--color-muted)",
          "--globe-icon": "var(--color-muted)",
          "--globe-wire": "var(--color-line-bright)",
          "--globe-error": "var(--color-live)",
        } as React.CSSProperties
      }
    >
      <DeployGlobeSvg height={height} key={animationKey} width={width}>
        <GlobeWireframe cx={cx} cy={cy} radius={radius} wireColor={wireColor} />

        {status !== "error"
          ? nodeData.map((node) => (
              <DeployPath
                accent={accent}
                duration={duration}
                id={`${node.id}-${animationKey}`}
                key={`p-${node.id}-${animationKey}`}
                pathD={node.pathD}
                waypoints={node.waypoints}
              />
            ))
          : null}

        {nodeData.map((node) => (
          <NodeMarker
            accent={accent}
            duration={duration}
            icon={node.icon}
            key={`nd-${node.id}`}
            waypointCount={node.waypoints.length}
            wireColor={wireColor}
            x={node.endPt.x}
            y={node.endPt.y}
          />
        ))}
      </DeployGlobeSvg>

      <DeployGlobeStatusBadge onReplay={replay} replayLabel={replayLabel} statusLabel={statusLabel} />
    </div>
  )
}

export { DeployGlobe }
