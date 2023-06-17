import {
  Box,
  Button,
  Heading,
  Img,
  Link,
  Stack,
  Text,
  Center,
  useColorModeValue as mode,
} from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import { HiPlay } from 'react-icons/hi'
import { NavbarLanding } from '../components/Navbar/NavbarLanding.jsx'
import { Features } from "../components/Features/Features.jsx"
import { Footer } from "../components/Footer/Footer.jsx";
import { useRouter } from 'next/router'
import { getAuth } from "firebase/auth"

export default function App() {
  const router = useRouter()
  const auth = getAuth();

  useEffect(() => {
    auth.onAuthStateChanged(function(user) {
      if (user) {
        router.push("/dashboard")
      } 
    });
  }, [])

  return (
    <>

    <NavbarLanding/>
    <Box as="section" bg={mode('gray.50', 'gray.800')} h="100vh" pt="32" pb="24">
      <Box maxW={{ base: 'xl', md: '8xl' }} mx="auto" px={{ base: '6', md: '8' }}>
        <Stack
          direction={{ base: 'column', lg: 'row' }}
          spacing={{ base: '3rem', lg: '2rem' }}
          mt="8"
          align={{ lg: 'center' }}
          justify="space-between"
        >
          <Box flex="1" >
            <Center>
            <Heading
              as="h1"
              size="3xl"
              color="blue.500"
              mt="8"
              fontWeight="700"
              
              
            >
              Compelling landing pages in one click
            </Heading>
            </Center>
            <Center>
            <Text color={mode('gray.600', 'gray.400')} mt="10" fontSize="xl" fontWeight="medium">
              Our platform, powered by LLMs and diffusion models, is the best way to create and share landing pages fast.
            </Text>
            </Center>
            <Center>
            <Stack direction={{ base: 'column', md: 'row' }} spacing="4" mt="8">
              <Button as="a" href="/signup" size="lg" minW="210px" colorScheme="blue" px="8">
                Let's get started
              </Button>
              
            </Stack>
            </Center>
            <Center>
            <Text mt="8" color={mode('gray.600', 'gray.400')}>
              Already have an account?{' '}
              <Link href="/login" textDecoration="underline" color="blue.500">
                Log in
              </Link>
            </Text>
            </Center>
          </Box>
          
        </Stack>
      </Box>
      
    </Box>
    {/* <Features/>
    <Footer/> */}

    </>
  )
}