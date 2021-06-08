import {
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  ModalCloseButton,
  ModalBody,
  Heading,
  Text,
  Center,
} from '@chakra-ui/react'
import { InviteForm } from './InviteForm'
import { User } from './types'

interface InviteMembersModalProps {
  isOpen: boolean
  onClose: () => void
  inviteMembers: (users: User[]) => void
}

export const InviteMembersModal = ({
  isOpen,
  onClose,
  inviteMembers,
}: InviteMembersModalProps) => {
  const onSubmit = (users) => {
    inviteMembers(users)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent bg="gray.700" p={10}>
        <ModalCloseButton color="gray.100" />
        <ModalBody color="gray.100">
          <Center pb={10}>
            <Heading size="lg" fontWeight="400">
              Invite members
            </Heading>
          </Center>
          <Text fontWeight="500" pb={2}>
            Email invite
          </Text>
          <Text color="gray.400" pb={5}>
            Send members an email invitation to join this workspace
          </Text>
          <Box>
            <InviteForm onSubmit={onSubmit} />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
