import React, { useState, useEffect, useCallback, useRef } from "react";

import { NavbarLanding } from "../../components/navbar/NavbarLanding";
import { Testimonial } from "../../components/Testimonial";

import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import Head from "next/head";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  Box,
  Heading,
  Center,
  HStack,
  Button,
  SimpleGrid,
  Stack,
  Text,
  Divider,
  Spinner,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Container,
  ModalCloseButton,
  Input,
  Flex,
  Spacer,
  Square,
  VStack,
  Image,
  Textarea,
  Select,
} from "@chakra-ui/react";

import { AiFillHome } from "react-icons/ai";
import { FaPaintBrush, FaGlobe } from "react-icons/fa";

export default function App() {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const [email, setEmail] = useState("");
  const [content, setContent] = useState({ content: {} });
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");

  const [themeModal, setThemeModal] = useState(false);
  const [themeLoading, setThemeLoading] = useState(false);
  const colorOptions = [
    "Blue",
    "Red",
    "Orange",
    "Green",
    "Teal",
    "Purple",
    "Pink",
  ];
  const colorValues = [
    "blue",
    "red",
    "orange",
    "green",
    "teal",
    "purple",
    "pink",
  ];

  const fonts = [
    "Inter",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Brush Script MT",
  ];

  const [colorScheme, setColorScheme] = useState("");
  const [font, setFont] = useState("");

  const onTheme = () => {
    setThemeLoading(true);
    let temp = content;
    temp.font = font;
    temp.colorScheme = colorScheme;

    updateDoc(doc(db, "pages", id), { font: font, colorScheme: colorScheme })
      .then((x) => {
        setContent(temp);
        setThemeLoading(false);
        setThemeModal(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (!user) {
        router.push("/login");
      } else {
        setEmail(user.email);

        if (router.isReady && id.length === 0) {
          const { pid } = router.query;
          setId(pid);
          console.log(pid);
          const docRef = doc(db, "pages", pid);

          getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
              setContent(docSnap.data());
              setLoading(false);
            } else {
              router.push("/dashboard");
            }
          });
        }
      }
    });
  }, [router.isReady]);
  return (
    <>
      <Head>
        <title>Click - {content.name}</title>
      </Head>

      {loading && (
        <Center>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.600"
            size="lg"
            mt="8"
          />
        </Center>
      )}

      <Modal
        isCentered
        isOpen={themeModal}
        onClose={() => {
          setThemeModal(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Theme</ModalHeader>
          <ModalBody>
            <Text fontSize="xs" mb="1" color="blue.500" fontWeight="bold">
              COLOR SCHEME
            </Text>
            <Select
              onChange={(e) => {
                setColorScheme(e.target.value);
              }}
              w="full"
              value={colorScheme}
              placeholder={null}
            >
              {colorOptions.map((option, i) => (
                <option value={colorValues[i]}>{option}</option>
              ))}
            </Select>

            <Text
              fontSize="xs"
              mb="1"
              mt="6"
              color="blue.500"
              fontWeight="bold"
            >
              FONT
            </Text>
            <Select
              onChange={(e) => {
                setFont(e.target.value);
              }}
              w="full"
              value={font}
              placeholder={null}
            >
              {fonts.map((option, i) => (
                <option value={option}>{option}</option>
              ))}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              colorScheme="red"
              size="sm"
              mr={3}
              onClick={() => {
                setThemeModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              size="sm"
              isLoading={themeLoading}
              onClick={() => {
                onTheme();
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {!loading && (
        <>
          <Box position="fixed" zIndex="100">
            <NavbarLanding />
          </Box>

          <Box
            zIndex="100"
            mt="14"
            position="fixed"
            w="full"
            bg="white"
            border="1px solid #E2E8F0"
            py="2"
          >
            <Box
              as="section"
              maxW="8xl"
              mx="auto"
              px={{
                base: "6",
                md: "8",
              }}
            >
              <Flex>
                <HStack>
                  <Text fontSize="xl" mr="5">
                    {content.name}
                  </Text>
                  <Button
                    leftIcon={<AiFillHome />}
                    onClick={() => {
                      router.push("/dashboard");
                    }}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                  >
                    Home
                  </Button>
                  <Button
                    leftIcon={<FaPaintBrush />}
                    variant="outline"
                    colorScheme="blue"
                    size="sm"
                    onClick={() => {
                      setThemeModal(true);
                      setColorScheme(content.colorScheme);
                      setFont(content.font);
                    }}
                  >
                    Theme
                  </Button>
                </HStack>
                <Spacer />
                <HStack>
                  <Button
                    leftIcon={<FaGlobe />}
                    onClick={() => {
                      window.open( window.location.protocol + "//" + window.location.host + "/page/" + id, "_blank");
                    }}
                    colorScheme="blue"
                    size="sm"
                  >
                    Visit
                  </Button>
                  {/* <Button leftIcon = {<BsArrowDownSquareFill/>}variant="outline" border="1px solid black" size="sm">Export</Button> */}
                </HStack>
              </Flex>
            </Box>
          </Box>

          <Box fontFamily={content.font} position="relative" pt="28" height={{ lg: '100vh' }}>
            <Container minW={{ base: "0", md: "1400" }} py={{ base: '16', md: '24' }} height="full">
              <Stack
                direction={{ base: 'column', lg: 'row' }}
                spacing={{ base: '16' }}
                align={{ lg: 'center' }}
                height="full"
              >
                <Stack spacing={{ base: '8', md: '12' }}>
                  <Stack spacing="4">
                    <Box><Image h="10" src={content.logo} objectFit="contain"></Image></Box>
                    
                    <Stack spacing={{ base: '4', md: '6' }} maxW={{ md: 'xl', lg: 'md', xl: 'xl' }}>
                      <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="bold">{content.content.heroTitle}</Text>
                      <Text fontSize={{ base: 'lg', md: 'xl' }}>
                        {content.content.heroSubtitle}
                      </Text>
                    </Stack>
                  </Stack>
                  <Stack direction={{ base: 'column', md: 'row' }} spacing="3">
                    <Button onClick={() => window.open(content.ctaButton, "_blank")} colorScheme={content.colorScheme} size="lg">
                      {content.content.heroButtonText}
                    </Button>
                    <Button size="lg" colorScheme={content.colorScheme} variant="outline" onClick={() => {
                        const section =
                          document.querySelector("#features-section");
                        section.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}>
                      Learn more
                    </Button>
                  </Stack>
                </Stack>
                <Box
                  pos={{ lg: 'absolute' }}
                  right="0"
                  bottom="0"
                  w={{ base: 'full', lg: '50%' }}
                  height={{ base: '96', lg: 'full' }}
                  sx={{
                    clipPath: { lg: 'polygon(7% 0%, 100% 0%, 100% 100%, 0% 100%)' },
                  }}
                >
                  <Image
                    boxSize="full"
                    objectFit="cover"
                    src={content.content.heroImage}
                    alt="IMAGE NOT FOUND"
                  />
                </Box>
              </Stack>
            </Container>
          </Box>

          <Container
            fontFamily={content.font}
            minW={{ base: "0", md: "1100" }}
            py={{ base: "0", md: "24" }}
          >
            <Stack spacing={{ base: "12", md: "16" }}>
              <Stack
                spacing={{ base: "4", md: "5" }}
                textAlign="center"
                align="center"
              >
                <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
                  {content.content.statisticsTitle}
                </Text>
                <Text fontSize={{ base: "lg", md: "xl" }} maxW="4xl">
                  {content.content.statisticsSubtitle}
                </Text>
              </Stack>
              <Box
                bg={content.colorScheme + ".500"}
                borderRadius="2xl"
                px={{ base: "0", md: "4", lg: "8" }}
                py={{ base: "0", md: "4", lg: "8" }}
              >
                <SimpleGrid columns={{ base: 1, md: 3 }} rowGap="8">
                  {[
                    {
                      value: content.content.statistic1Text,
                      label: content.content.statistic1Subtext,
                    },
                    {
                      value: content.content.statistic2Text,
                      label: content.content.statistic2Subtext,
                    },
                    {
                      value: content.content.statistic3Text,
                      label: content.content.statistic3Subtext,
                    },
                  ].map((stat, id) => (
                    <Stack spacing="3" textAlign="center" color="white">
                      <Text
                        fontSize={{
                          base: "3xl",
                          md: "5xl",
                        }}
                        fontWeight="bold"
                      >
                        {stat.value}
                      </Text>
                      <Text
                        fontSize="lg"
                        fontWeight="medium"
                        color="fg.accent.muted"
                      >
                        {stat.label}
                      </Text>
                    </Stack>
                  ))}
                </SimpleGrid>
              </Box>
            </Stack>
          </Container>
          <Box id="features-section" fontFamily={content.font} as="section">
            <Container
              minW={{ base: "0", md: "1100" }}
              py={{ base: "0", md: "12" }}
            >
              <Stack spacing={{ base: "12", md: "16" }}>
                <Stack spacing={{ base: "4", md: "5" }} maxW="4xl">
                  <Stack spacing="3">
                    <Text
                      fontSize={{ base: "md", md: "lg" }}
                      fontWeight="semibold"
                      color={content.colorScheme + ".500"}
                    >
                      Features
                    </Text>
                    <Text
                      fontSize={{ base: "md", md: "4xl" }}
                      fontWeight="bold"
                    >
                      {content.content.featuresTitle}
                    </Text>
                  </Stack>
                  <Text color="fg.muted" fontSize={{ base: "lg", md: "xl" }}>
                    {content.content.featuresSubtitle}
                  </Text>
                </Stack>
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 3 }}
                  columnGap={8}
                  rowGap={{ base: 10, md: 16 }}
                >
                  {[
                    {
                      name: content.content.feature1Name,
                      description: content.content.feature1Description,
                      image: content.content.feature1Image,
                    },
                    {
                      name: content.content.feature2Name,
                      description: content.content.feature2Description,
                      image: content.content.feature2Image,
                    },
                    {
                      name: content.content.feature3Name,
                      description: content.content.feature3Description,
                      image: content.content.feature3Image,
                    },
                  ].map((feature) => (
                    <Stack key={feature.name} spacing={{ base: "4", md: "5" }}>
                      <Stack spacing={{ base: "1", md: "2" }} flex="1">
                        <Image
                          objectFit="cover"
                          src={feature.image}
                          boxSize="300"
                        ></Image>
                        <Text
                          fontSize={{ base: "lg", md: "xl" }}
                          fontWeight="bold"
                          pt="5"
                        >
                          {feature.name}
                        </Text>
                        <Text color="fg.muted">{feature.description}</Text>
                      </Stack>
                    </Stack>
                  ))}
                </SimpleGrid>
              </Stack>
            </Container>
          </Box>
          <Container
            minW={{ base: "0", md: "1100" }}
            py={{ base: "8", md: "16" }}
            fontFamily={content.font}
          >
            <Box
              bg={content.colorScheme + ".500"}
              color="white"
              borderRadius="xl"
              px={{ base: "6", lg: "16" }}
              py={{ base: "10", lg: "16" }}
            >
              <Stack
                spacing="8"
                direction={{ base: "column", lg: "row" }}
                justify="space-between"
              >
                <Stack spacing="4" maxW="2xl">
                  <Text fontSize="3xl" fontWeight="bold">
                    {content.content.ctaTitle}
                  </Text>
                  <Text
                    color="fg.accent.muted"
                    fontSize={{ base: "lg", lg: "xl" }}
                  >
                    {content.content.ctaSubtitle}
                  </Text>
                </Stack>
                <Stack
                  spacing="3"
                  direction={{ base: "column", sm: "row" }}
                  justify={{ base: "start" }}
                >
                  <Button
                    variant="solid"
                    color={content.colorScheme + ".500"}
                    bg="white"
                    size="lg"
                    onClick={() => window.open(content.ctaButton, "_blank")}
                  >
                    {content.content.ctaButtonText}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Container>

          <Box
            as="section"
            py={{
              base: "0",
              md: "8",
            }}
            fontFamily={content.font}
          >
            <Container minW={{ base: "0", md: "1100" }}>
              <Text
                fontSize={{ base: "md", md: "4xl" }}
                fontWeight="bold"
                pb="12"
              >
                What are they saying?
              </Text>
              <Stack
                direction={{
                  base: "column",
                  lg: "row",
                }}
                spacing="16"
              >
                {[
                  {
                    name: content.content.testimonial1Name,
                    title: content.content.testimonial1Position,
                    quote: content.content.testimonial1Quote,
                  },
                  {
                    name: content.content.testimonial2Name,
                    title: content.content.testimonial2Position,
                    quote: content.content.testimonial2Quote,
                  },
                ].map((testimonial, id) => (
                  <Testimonial
                    color={content.colorScheme}
                    key={id}
                    {...testimonial}
                  />
                ))}
              </Stack>
            </Container>
          </Box>

          <Box bg={"gray.50"} mt="24" fontFamily={content.font}>
            <Container
              minW={{ base: "0", md: "1100" }}
              as="footer"
              role="contentinfo"
              py={{ base: "12", md: "16" }}
            >
              <Stack spacing={{ base: "4", md: "5" }}>
                <Stack justify="space-between" direction="row" align="center">
                  <Image
                    src={content.logo}
                    w="40"
                    h="20"
                    objectFit="contain"
                  ></Image>
                </Stack>
                <Text fontSize="sm" color="fg.accent.subtle">
                  &copy; {new Date().getFullYear()} {content.name}, All rights
                  reserved.
                </Text>
              </Stack>
            </Container>
          </Box>
        </>
      )}
    </>
  );
}
