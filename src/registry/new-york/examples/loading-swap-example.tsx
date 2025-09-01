"use client"

import { Button } from "@/components/ui/button"
import { LoadingSwap } from "@/registry/new-york/ui/loading-swap"
import { useTransition } from "react"

export default function LoadingButton() {
  const [isLoading, startTransition] = useTransition()

  return (
    <Button
      onClick={() => {
        startTransition(async () => {
          // Simulate loading state
          await new Promise(res => setTimeout(res, 1000))
        })
      }}
    >
      <LoadingSwap isLoading={isLoading}>Click Me</LoadingSwap>
    </Button>
  )
}