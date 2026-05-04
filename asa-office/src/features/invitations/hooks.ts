'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getInvitations, createInvitation, revokeInvitation } from './api'
import type { InvitationRole } from './types'

export function useInvitations(params?: { status?: string }) {
  return useQuery({
    queryKey: ['invitations', params],
    queryFn:  () => getInvitations(params),
  })
}

export function useCreateInvitation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { email: string; role: InvitationRole }) => createInvitation(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['invitations'] }),
  })
}

export function useRevokeInvitation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (uuid: string) => revokeInvitation(uuid),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['invitations'] }),
  })
}
