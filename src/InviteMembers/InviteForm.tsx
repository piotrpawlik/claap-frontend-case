import { Box, Button, HStack } from '@chakra-ui/react'
import { InviteMembersInput } from './Input'

export const InviteForm = () => {
  return (
    <Box>
      <HStack>
        <InviteMembersInput />
        <Button isDisabled={true}>Invite</Button>
      </HStack>
    </Box>
  )
}
