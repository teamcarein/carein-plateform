import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#F0FAF6] p-8">
      <div className="max-w-sm w-full text-center space-y-6">

        {/* Logo */}
        <div className="w-16 h-16 rounded-[18px] bg-[#00C896]/10 flex items-center justify-center mx-auto">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h3l3-7 3 14 3-10 2 3h4" stroke="#00C896" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="space-y-1">
          <p className="text-6xl font-extrabold text-[#00C896]/20 tracking-tighter">404</p>
          <h1 className="text-xl font-extrabold tracking-tight -mt-2">Page introuvable</h1>
          <p className="text-sm text-foreground/50">
            Cette page n&apos;existe pas ou n&apos;est pas accessible avec votre compte.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-sm font-semibold bg-[#00C896] text-white hover:bg-[#009B73] transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  )
}
