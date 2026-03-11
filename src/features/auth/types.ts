export type AuthUser = {
  id: number
  email: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user: AuthUser
}
