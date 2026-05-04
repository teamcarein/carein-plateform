'use client'

import { Copy } from 'lucide-react'

export function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="p-2 rounded-[6px] hover:bg-foreground/5 text-foreground/40 hover:text-foreground transition-colors"
    >
      <Copy size={14} />
    </button>
  )
}
