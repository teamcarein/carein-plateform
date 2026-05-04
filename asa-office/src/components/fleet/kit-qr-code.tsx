'use client'

import { useRef, useCallback } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download, Printer } from 'lucide-react'
import { Button } from '@carein/ui-kit'
import type { Kit, KitType } from '@/features/fleet/types'

function formatKitType(type: KitType): string {
  const labels: Record<KitType, string> = {
    maternity:   'Maternité',
    cardiology:  'Cardiologie',
    pediatrics:  'Pédiatrie',
    general:     'Généraliste',
    custom:      'Personnalisé',
  }
  return labels[type] ?? type
}

interface KitQrCodeProps {
  kit: Kit
}

export function KitQrCode({ kit }: KitQrCodeProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const qrValue   = kit.uuid

  const downloadPng = useCallback(() => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const url  = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href     = url
    link.download = `valise-${kit.code}.png`
    link.click()
  }, [kit.code])

  const printLabel = useCallback(() => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const qrDataUrl = canvas.toDataURL('image/png')

    const win = window.open('', '_blank', 'width=420,height=520')
    if (!win) return

    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Étiquette — ${kit.code}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: system-ui, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: #fff;
            }
            .label {
              border: 2px solid #000;
              border-radius: 12px;
              padding: 24px;
              width: 320px;
              text-align: center;
            }
            .label img {
              width: 200px;
              height: 200px;
              display: block;
              margin: 0 auto 16px;
            }
            .code {
              font-size: 22px;
              font-weight: 800;
              font-family: monospace;
              letter-spacing: 2px;
              margin-bottom: 4px;
            }
            .name {
              font-size: 13px;
              color: #555;
              margin-bottom: 2px;
            }
            .type {
              font-size: 11px;
              color: #888;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .logo {
              font-size: 11px;
              color: #aaa;
              margin-top: 14px;
              border-top: 1px solid #eee;
              padding-top: 10px;
            }
            @media print {
              body { min-height: unset; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <img src="${qrDataUrl}" alt="QR Code" />
            <p class="code">${kit.code}</p>
            <p class="name">${kit.name}</p>
            <p class="type">${formatKitType(kit.kit_type)}</p>
            <p class="logo">CareIN Console</p>
          </div>
          <script>window.onload = () => { window.print(); window.onafterprint = () => window.close() }<\/script>
        </body>
      </html>
    `)
    win.document.close()
  }, [kit])

  return (
    <div className="flex flex-col items-center gap-4">

      {/* QR code */}
      <div
        ref={canvasRef}
        className="p-4 rounded-[14px] bg-white border border-border shadow-sm"
      >
        <QRCodeCanvas
          value={qrValue}
          size={180}
          level="M"
          marginSize={1}
          imageSettings={{
            src: '/logo-qr.svg',
            height: 32,
            width: 32,
            excavate: true,
          }}
        />
      </div>

      {/* Kit info sous le QR */}
      <div className="text-center">
        <p className="font-mono text-sm font-bold tracking-wider">{kit.code}</p>
        <p className="text-xs text-foreground/50 mt-0.5">{kit.name}</p>
        <p className="text-[10px] text-foreground/30 uppercase tracking-wide mt-0.5">
          {formatKitType(kit.kit_type)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={downloadPng}>
          <Download size={13} />
          PNG
        </Button>
        <Button size="sm" variant="outline" onClick={printLabel}>
          <Printer size={13} />
          Imprimer
        </Button>
      </div>

    </div>
  )
}
