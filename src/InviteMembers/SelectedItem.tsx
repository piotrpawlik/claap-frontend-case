import { Flex, Avatar, Box } from '@chakra-ui/react'
import { CloseIcon, EmailIcon } from '@chakra-ui/icons'

interface SelectedItemProps {
  onRemoveClick: () => void
  label: 'string'
  type: 'email' | 'user'
}

export const SelectedItem = ({
  onRemoveClick,
  label,
  type,
  ...rest
}: SelectedItemProps) => {
  return (
    <Flex
      border="2px"
      borderColor="tomato"
      borderRadius="md"
      px={2}
      py={1}
      align="center"
      {...rest}
    >
      <Box mr={3}>
        {type === 'email' ? (
          <EmailIcon w={5} h={5} color="tomato" />
        ) : (
          <Avatar name={label} w={6} h={6} bg="tomato" color="white" />
        )}
      </Box>
      <Box color="tomato">{label}</Box>
      <Box ml={3} color="tomato">
        <CloseIcon onClick={onRemoveClick} w={3} h={3} />
      </Box>
    </Flex>
  )
}
