import { Flex, Avatar, Box } from '@chakra-ui/react'
import { CloseIcon, EmailIcon } from '@chakra-ui/icons'

interface SelectedItemProps {
  onRemoveClick: () => void
  label: 'string'
  type: 'email' | 'user'
}

const color = 'red.400'

export const SelectedItem = ({
  onRemoveClick,
  label,
  type,
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
        {type === 'email' ? (
          <EmailIcon w={5} h={5} color={color} />
        ) : (
          <Avatar name={label} w={6} h={6} bg={color} color="white" />
        )}
      </Box>
      <Box color={color}>{label}</Box>
      <Box ml={3} color={color}>
        <CloseIcon onClick={onRemoveClick} w={3} h={3} cursor="pointer" />
      </Box>
    </Flex>
  )
}
