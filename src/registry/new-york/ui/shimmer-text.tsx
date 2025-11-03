"use client"
import React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"


interface ShimmerTextProps{
  children:React.ReactNode,
  className?:string,
  duration?: number,
  shimmerColor?:string,
  shimmerWidth?:number,
  reverse?:boolean
}


export function ShimmerText({children,className,duration=2,shimmerColor="#ffffff",shimmerWidth = 10,reverse=false}:ShimmerTextProps){

  const halfWidth = shimmerWidth / 2
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
      ${shimmerColor} ${startPercent}%,
      ${shimmerColor} ${endPercent}%,
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

  className={cn(`bg-clip-text text-gray-200/20 `,className)}
  >
   {children}

  </motion.span>
}
