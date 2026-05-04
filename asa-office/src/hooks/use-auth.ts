'use client'

import { useCallback } from 'react'

export function useAuth() {
  const logout = useCallback(() => {
    window.location.href = '/api/auth/logout'
  }, [])

  return { logout, isPending: false }
}
