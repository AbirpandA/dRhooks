"use client"
import React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"


interface ShimmerTextProps{
  children:React.ReactNode,
  className?:string,
  duration?: number,
  shimmerWidth?:number,
  reverse?:boolean
}


export function ShimmerText({children,className,duration=2,shimmerWidth = 10,reverse=false}:ShimmerTextProps){

  const validatedShimmerWidth = Math.max(0, Math.min(shimmerWidth, 80));
  const halfWidth = validatedShimmerWidth / 2
  const startPercent = 50 - halfWidth
  const endPercent = 50 + halfWidth

  const animationVariants={
    initial:{backgroundPosition: reverse? "-250% 0":"250% 0"},
    animate:{backgroundPosition: reverse? "250% 0":"-250% 0"}
  }

  const shimmerStyle = {
    backgroundImage: `linear-gradient(
      110deg,
      transparent ${startPercent -10}%, 
      var(--shimmer-color) ${startPercent}%,
      var(--shimmer-color) ${endPercent}%,
      transparent ${endPercent +10}%
    )`,
    backgroundSize: "250% 100%",
  }

  return <motion.span
  variants={animationVariants}
  initial="initial"
  animate="animate"
  transition={{
    repeat:Infinity,
    ease:"linear",
    duration:duration
  }}

  style={shimmerStyle}

  className={cn(`bg-clip-text text-gray-800/20`,`dark:text-gray-200/20`,`dark:[--shimmer-color:theme(colors.white)]`,`[--shimmer-color:theme(colors.slate.900)]`,className)}
  >
   {children}

  </motion.span>
}
