export interface AuthUser {
  id: number
  name: string
  email: string
  role: 'carein_admin' | 'carein_support'
}
