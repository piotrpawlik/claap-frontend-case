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

interface InviteMembersModalProps {
  isOpen: boolean
  onClose: () => void
}

export const InviteMembersModal = ({
  isOpen,
  onClose,
}: InviteMembersModalProps) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Invite members</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Heading>Email invite</Heading>
        <Text>Send members an email invitation to join this workspace</Text>
        <InviteForm />
      </ModalBody>
    </ModalContent>
  </Modal>
)
