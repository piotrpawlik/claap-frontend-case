import { useState } from 'react'
import {
  ChakraProvider,
  Button,
  Flex,
  useDisclosure,
  extendTheme,
} from '@chakra-ui/react'
import { InviteMembersModal } from './InviteMembers/InviteMembersModal'
import { User } from './InviteMembers/types'
import { themeOverwrites } from './theme'

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [invitedMembers, inviteMembers] = useState<User>(null)

  const theme = extendTheme(themeOverwrites)

  return (
    <ChakraProvider theme={theme}>
      {invitedMembers ? <div>{JSON.stringify(invitedMembers)}</div> : null}
      <Flex align="center" justify="center" style={{ height: '100vh' }}>
        <Button onClick={onOpen}>Invite teammates</Button>
        <InviteMembersModal
          isOpen={isOpen}
          onClose={onClose}
          inviteMembers={inviteMembers as () => void}
        />
      </Flex>
    </ChakraProvider>
  )
}

export default App
