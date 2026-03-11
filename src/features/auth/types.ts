export type AuthUser = {
  id: string
  email: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user?: AuthUser
}
