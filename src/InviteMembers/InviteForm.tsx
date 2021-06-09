import { Button } from '@chakra-ui/react'
import { InviteMembersInput } from './Input'

export const InviteForm = ({ onSubmit }) => {
  const onInviteClick =
    ({ selectedUsers, resetInput }) =>
    () => {
      onSubmit(selectedUsers)
      resetInput()
    }

  const isDisabled = (selectedUsers) => selectedUsers.length === 0

  return (
    <InviteMembersInput onSubmit={onSubmit}>
      {({ selectedItems, resetInput }) => {
        return (
          <Button
            isDisabled={isDisabled(selectedItems)}
            onClick={onInviteClick({
              selectedUsers: selectedItems,
              resetInput,
            })}
          >
            Invite
          </Button>
        )
      }}
    </InviteMembersInput>
  )
}
