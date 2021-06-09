import { Flex, Box } from '@chakra-ui/react'
import { User } from './types'
import { CloseIcon } from '@chakra-ui/icons'
import { InviteeIcon } from './InviteeIcon'

interface SelectedItemProps {
  onRemoveClick: () => void
  label: 'string'
  user: User
}

const color = 'red.400'

export const SelectedItem = ({
  onRemoveClick,
  label,
  user,
  ...rest
}: SelectedItemProps) => {
  return (
    <Flex
      border="2px"
      borderColor={color}
      borderRadius="md"
      px={2}
      py={1}
      align="center"
      {...rest}
    >
      <Box mr={3}>
        <InviteeIcon user={user} color={color} />
      </Box>
      <Box color={color}>{label}</Box>
      <Box ml={3} color={color}>
        <CloseIcon onClick={onRemoveClick} w={3} h={3} cursor="pointer" />
      </Box>
    </Flex>
  )
}
