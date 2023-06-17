import { Box, useColorModeValue as mode } from '@chakra-ui/react'
import * as React from 'react'
import { NavContent } from './NavContent'

export const NavbarLanding = (props) => {
  return (
    
      <Box position="relative" bg="white" w="100vw" as="header" zIndex="10">
        <Box
          as="nav"
          aria-label="Main navigation"
          maxW="12xl"
          mx="auto"
          px={{
            base: '6',
            md: '8',
          }}
        >
          <NavContent.Mobile
            display={{
              base: 'flex',
              lg: 'none',
            }}
          />
          <NavContent.Desktop
            shouldShowCreate ={props.shouldShowCreate}
            setCreateModal = {props.setCreateModal}
            display={{
              base: 'none',
              lg: 'flex',
            }}
          />
        </Box>
      </Box>
    
  )
}
