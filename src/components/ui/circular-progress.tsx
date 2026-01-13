import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface CircularProgressProps {
  value: number
  max?: number
  label?: string
  size?: number
  strokeWidth?: number
  className?: string
  labelClassName?: string
  valueClassName?: string
  trackColor?: string
  progressColor?: string
}

export function CircularProgress({
  value,
  max = 100,
  label,
  size = 256,
  strokeWidth = 12,
  className,
  labelClassName,
  valueClassName,
  trackColor = "text-zinc-900",
  progressColor = "text-emerald-500"
}: CircularProgressProps) {
  const [progress, setProgress] = useState(0)

  // Animate from 0 to value on mount, and update when value changes
  useEffect(() => {
    // Small timeout to ensure the initial render (0) happens before transition
    const timer = setTimeout(() => setProgress(value), 100)
    return () => clearTimeout(timer)
  }, [value])

  const radius = (size - strokeWidth) / 2 - 10 // Subtracting a bit more for safe padding similar to original (110 radius vs 128 center)
  const circumference = 2 * Math.PI * radius
  
  // Ensure progress doesn't exceed max or go below 0
  const normalizedProgress = Math.min(Math.max(progress, 0), max)
  const offset = circumference - (normalizedProgress / max) * circumference

  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 transform overflow-visible"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={trackColor}
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", progressColor)}
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={cn("text-6xl font-bold tracking-tighter text-white", valueClassName)}>
          {Math.round(normalizedProgress)}%
        </span>
        {label && (
           <span className={cn("mt-2 text-xs font-bold tracking-widest text-zinc-500", labelClassName)}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
