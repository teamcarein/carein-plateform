'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@carein/ui-kit'
import { InviteTeamMemberForm } from './invite-form'

export function TeamActions() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-end gap-3">
      {!open && (
        <Button onClick={() => setOpen(true)}>
          <Plus size={14} />
          Inviter un membre
        </Button>
      )}
      {open && (
        <div className="w-[480px]">
          <InviteTeamMemberForm onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  )
}
