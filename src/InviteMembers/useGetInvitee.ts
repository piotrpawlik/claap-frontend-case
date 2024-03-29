import { User, KnownUser, UnknownUser } from './types'
import { searchUser, normalize } from './searchUsers'
import { useEffect, useState } from 'react'
import { useBoolean } from 'react-use'
import compact from 'lodash/compact'

const notAlreadySelected = (selectedUsers: User[], email: string): boolean =>
  !selectedUsers.map((user) => user.email).includes(email)

export const useGetInvitee = ({ inputValue, selectedItems }) => {
  const [searchedUsers, setSearchedUsers] = useState<KnownUser[]>([])
  const [unknownUser, setUnkownUser] = useState<UnknownUser>(null)
  const [isLoading, setLoading] = useBoolean(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (error) {
      setError(null)
    }

    if (inputValue.match(/.*@.*/)) {
      const regexp = /(.+)@(.+){2,}\.(.+){2,}/
      const normalizedPossibleEmail = normalize(inputValue)

      setSearchedUsers([])

      if (
        normalizedPossibleEmail.match(regexp) &&
        notAlreadySelected(selectedItems, normalizedPossibleEmail)
      ) {
        setUnkownUser({ email: normalizedPossibleEmail })
      } else {
        setUnkownUser(null)
      }
    } else {
      setLoading(true)
      setUnkownUser(null)
      searchUser(inputValue)
        .then((users) => {
          setLoading(false)
          setSearchedUsers(
            users.filter((user) =>
              notAlreadySelected(selectedItems, user.email)
            )
          )
        })
        .catch(() => {
          setLoading(false)
          setError('Error getting list of known users. Please try again.')
        })
    }
  }, [inputValue])

  return { users: compact([unknownUser, ...searchedUsers]), isLoading, error }
}
