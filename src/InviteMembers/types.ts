interface BaseUser {
  email: string
}

export type UnknownUser = BaseUser

interface KnowUserAttributes {
  firstName: string
  lastName: string
  id: string
}

export interface KnownUser extends UnknownUser, KnowUserAttributes {}

export interface User extends UnknownUser, Partial<KnowUserAttributes> {}
