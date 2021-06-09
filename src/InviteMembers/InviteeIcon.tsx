import { User } from './types'
import { EmailIcon } from '@chakra-ui/icons'
import { Avatar } from '@chakra-ui/react'

interface InviteeIconProps {
  user: User
  color?: string
}

export const InviteeIcon = ({ user, color }: InviteeIconProps) => {
  if (user['firstName']) {
    return <Avatar name={user.firstName} w={6} h={6} bg={color} color="white" />
  } else {
    return <EmailIcon w={5} h={5} color={color} />
  }
}
