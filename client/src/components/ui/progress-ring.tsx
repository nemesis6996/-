import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  strokeColor?: string;
  bgStrokeColor?: string;
  showPercent?: boolean;
  className?: string;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({
  percent,
  size = 100,
  strokeWidth = 7,
  strokeColor = "white",
  bgStrokeColor = "#FF7957",
  showPercent = true,
  className,
  label,
  sublabel,
}: ProgressRingProps) {
  const [offset, setOffset] = useState(0);
  
  // SVG center point
  const center = size / 2;
  
  // Radius is the center minus the stroke width to keep the circle inside the SVG
  const radius = center - strokeWidth / 2;
  
  // Circle circumference
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Calculate the dash offset based on the percentage
    const calculatedOffset = ((100 - percent) / 100) * circumference;
    setOffset(calculatedOffset);
  }, [percent, circumference]);

  return (
    <div className={cn("inline-flex items-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={bgStrokeColor}
          strokeWidth={strokeWidth}
        />
        <circle
          className="progress-ring-circle"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        {showPercent && (
          <text
            x={center}
            y={center}
            fontFamily="Montserrat"
            fontSize={size * 0.18}
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            fill={strokeColor}
          >
            {Math.round(percent)}%
          </text>
        )}
      </svg>
      
      {(label || sublabel) && (
        <div className="ml-3">
          {label && <h3 className="text-lg font-semibold">{label}</h3>}
          {sublabel && <p className="text-white/90">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}
