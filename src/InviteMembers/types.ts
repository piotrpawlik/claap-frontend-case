interface BaseUser {
  email: string
}

export interface User {
  email: string
  firstName?: string
  lastName?: string
  id?: string
}

export type UnknownUser = BaseUser

export interface KnownUser extends BaseUser {
  firstName: string
  lastName: string
  id: string
}
