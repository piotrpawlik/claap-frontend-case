import { ChakraProvider, Button, Flex } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <Flex align="center" justify="center" style={{ height: '100vh' }}>
        <Button>Invite teammates</Button>
      </Flex>
    </ChakraProvider>
  )
}

export default App
