import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Heading,
  Text,
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Invite members</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Heading>Email invite</Heading>
          <Text>Send members an email invitation to join this workspace</Text>
          <InviteForm onSubmit={onSubmit} />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
