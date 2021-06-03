import { ChakraProvider, Button, Flex, useDisclosure } from '@chakra-ui/react'
import { InviteMembersModal } from './InviteMembers/InviteMembersModal'

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <ChakraProvider>
      <Flex align="center" justify="center" style={{ height: '100vh' }}>
        <Button onClick={onOpen}>Invite teammates</Button>
        <InviteMembersModal isOpen={isOpen} onClose={onClose} />
      </Flex>
    </ChakraProvider>
  )
}

export default App
