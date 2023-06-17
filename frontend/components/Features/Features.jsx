import { Box, SimpleGrid, Heading, Image, Center, Square } from '@chakra-ui/react'
import * as React from 'react'


export const Features = () => (
  <Box
    as="section"
    maxW="8xl"
    mx="auto"
    pt="12"
    mb="8"
    px={{
      base: '6',
      md: '8',
    }}
  >
    <Center mt="5" mb="4">
      <Heading size="md">Built with:</Heading>
    </Center>
    
    <SimpleGrid
      columns={{
        base: 2,
        md: 4,
        lg: 6
      }}
      spacingX="20"
      spacingY={{
        base: '8',
        md: '14',
      }}
    >
      <Square size="150px" ><Image src='/openai.png' /></Square>
      
      <Square size="150px" ><Image src='/react.png' /></Square>
      <Square size="150px" ><Image src='/nextjs.png' alt='Dan Abramov' /></Square>
      <Square size="150px" ><Image src='/firebase.png' alt='Dan Abramov' /></Square>
      <Square size="150px" ><Image src='/python.png' alt='Dan Abramov' /></Square>
      <Square size="150px" ><Image src='/fastapi.png' alt='Dan Abramov' /></Square>
      

    </SimpleGrid>
  </Box>
)