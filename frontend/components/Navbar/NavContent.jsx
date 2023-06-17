import {
  Box,
  Button,
  Flex,
  HStack,
  useColorModeValue as mode,
  useDisclosure,
  VisuallyHidden,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Image } from "@chakra-ui/react";

import { useRouter } from "next/router";
import { getAuth, signOut } from "firebase/auth";

const DesktopNavContent = (props) => {
  const router = useRouter();
  const auth = getAuth();
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (user) {
        setLoggedIn(true);
      }
    });
  }, []);

  const onLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        console.log("Logout failed.");
      });
  };
  return (
    <Flex
      className="nav-content__desktop"
      align="center"
      justify="space-between"
      {...props}
    >
      <Box mt="3" mb="3" as="a" href="/" rel="home">
        <VisuallyHidden>Landing Page Generator</VisuallyHidden>
        <Image h="8" src="/logo.png" />
      </Box>
      {!loggedIn && (
        <HStack spacing="8" justify="space-between">
          <Box
            as="a"
            href="/login"
            color="blue.500"
            fontWeight="bold"
          >
            Login
          </Box>
          <Button as="a" href="/signup" colorScheme="blue" fontWeight="bold">
            Sign up
          </Button>
        </HStack>
      )}

      {loggedIn && (
        <HStack spacing="8" justify="space-between">
           {props.shouldShowCreate && (
            <Button onClick={() => props.setCreateModal(true)} colorScheme="teal" fontWeight="bold">
            New page
          </Button>
           )}
           
          <Button onClick={onLogout} colorScheme="blue" fontWeight="bold">
            Log out
          </Button>
        </HStack>
      )}
    </Flex>
  );
};

const MobileNavContent = (props) => {
  return (
    <Flex
      className="nav-content__desktop"
      align="center"
      justify="space-between"
      {...props}
    >
      <Box mt="3" mb="3" as="a" href="/" rel="home">
        <VisuallyHidden>Landing Page Generator</VisuallyHidden>
        <Image h="8" src="/logo.png" />
      </Box>
    </Flex>
  );
};

export const NavContent = {
  Mobile: MobileNavContent,
  Desktop: DesktopNavContent,
};

