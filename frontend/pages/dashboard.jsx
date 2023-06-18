import React, { useState, useEffect } from "react";

import { NavbarLanding } from "../components/Navbar/NavbarLanding";
import { useRouter } from "next/router";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
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
  ModalCloseButton,
  Input,
  Link,
  Image,
  Textarea
} from "@chakra-ui/react";

export default function App() {
  const router = useRouter();
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const [email, setEmail] = useState("");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteID, setDeleteID] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [createModal, setCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createDescription, setCreateDescription] = useState("");
  const [createCtaButton, setCreateCtaButton] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createLogoPreview, setCreateLogoPreview] = useState(null);
  const [createLogoPreviewURL, setCreateLogoPreviewURL] = useState("");

  const [renameModal, setRenameModal] = useState(false);
  const [renameName, setRenameName] = useState("");
  const [renameID, setRenameID] = useState(""); 
  const [renameLoading, setRenameLoading] = useState(false);

  const uuidv4 = () => {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }
  const deletePage = (id) => {
    setDeleteLoading(true);
    deleteDoc(doc(db, "pages", id)).then(() => {
      let temp = [];
      content.map(k => {
        if (k.id !== id){
          temp.push(k)
        }
      })

      setContent(temp);
      setDeleteLoading(false);
      setDeleteModal(false);
    }).catch(err => {
      setDeleteLoading(false);
    });

  }

  const onSelectLogo = (e) => {
    let temp = e.target.files[0];
    setCreateLogoPreview(temp);
    setCreateLogoPreviewURL(URL.createObjectURL(temp));
  }
  const createPage = () => {
    setCreateLoading(true);
    let current = new Date();

    let imageId = uuidv4() + ".png";
    const storageRef = ref(storage, imageId);

    uploadBytes(storageRef, createLogoPreview).then((snapshot) => {
      getDownloadURL(storageRef).then(url => {
        const formData = new FormData();
        formData.append("description", createDescription);
        fetch(
          "https://nandvinchhi.serveo.net/create",
          {
            method: "POST",
            body: formData,
          }
        ).then(response => response.json()).then(result => {
          console.log(result);
          
          let data = {
            name: createName,
            date: current.getDate(),
            month: current.getMonth() + 1,
            year: current.getFullYear(),
            email: email,
            content: result.data,
            colorScheme: "teal",
            font: "Inter",
            logo: url,
            ctaButton: createCtaButton,
          }
      
          addDoc(collection(db, "pages"), data).then(() => {
            const q = query(
              collection(db, "pages"),
              where("email", "==", email)
            );
      
            getDocs(q)
              .then((snapshot) => {
                let temp = [];
                snapshot.forEach((doc) => {
                  // doc.data() is never undefined for query doc snapshots
                  let tempdata = doc.data();
                  temp.push({
                    id: doc.id,
                    name: tempdata.name,
                    logo: tempdata.logo,
                    date: tempdata.date,
                    month: tempdata.month,
                    year: tempdata.year,
                  });
                });
                temp.sort(function (a, b) {
                  if (
                    a.year * 10000 + a.month * 100 + a.date >
                    b.year * 10000 + b.month * 100 + b.date
                  ) {
                    return -1;
                  } else if (
                    a.year * 10000 + a.month * 100 + a.date >
                    b.year * 10000 + b.month * 100 + b.date
                  ) {
                    return 1;
                  } else {
                    return 0;
                  }
                });
                setContent(temp);
                setCreateLoading(false);
                setCreateModal(false);
                setCreateName("");
                setCreateCtaButton("");
                setCreateDescription("");
                setCreateLogoPreview(null);
                setCreateLogoPreviewURL("");
              })
              .catch((err) => {
                console.log(err);
                setCreateLoading(false);
              });
          }).catch(err => {
            console.log(err);
            setCreateLoading(false);
          })
        }).catch(e => {
          console.log(e);
          setLoading(false);
        });
        
    
      }); 
    });

    
  }

  useEffect(() => {
    auth.onAuthStateChanged(function (user) {
      if (!user) {
        router.push("/login");
      } else {
        setEmail(user.email);

        const q = query(
          collection(db, "pages"),
          where("email", "==", user.email)
        );

        getDocs(q)
          .then((snapshot) => {
            let temp = [];
            snapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              let tempdata = doc.data();
              temp.push({
                id: doc.id,
                name: tempdata.name,
                logo: tempdata.logo,
                date: tempdata.date,
                month: tempdata.month,
                year: tempdata.year,
              });
            });
            temp.sort(function (a, b) {
              if (
                a.year * 10000 + a.month * 100 + a.date >
                b.year * 10000 + b.month * 100 + b.date
              ) {
                return -1;
              } else if (
                a.year * 10000 + a.month * 100 + a.date >
                b.year * 10000 + b.month * 100 + b.date
              ) {
                return 1;
              } else {
                return 0;f
              }
            });
            setContent(temp);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    });
  }, []);
  return (
    <>
      <Modal isCentered isOpen={deleteModal} onClose={() => {setDeleteModal(false)}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm delete</ModalHeader>

          <ModalFooter>
            <Button variant="outline" colorScheme="red" size="sm" mr={3} onClick={() => {setDeleteModal(false)}}>
              Cancel
            </Button>
            <Button colorScheme="red" size="sm" isLoading={deleteLoading} onClick={() => {deletePage(deleteID)}}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isCentered size="xl" isOpen={createModal} onClose={() => {setCreateModal(false)}}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a new landing page</ModalHeader>
          <ModalBody>
            <Input placeholder="Enter name" size="sm" w="full" value={createName} onChange={e => {setCreateName(e.target.value)}}></Input>
            <Input mt="3" placeholder="Enter call to action URL" size="sm" w="full" value={createCtaButton} onChange={e => {setCreateCtaButton(e.target.value)}}></Input>
            <Textarea mt="3" placeholder="Enter description" size="sm" w="full" value={createDescription} onChange={e => {setCreateDescription(e.target.value)}}></Textarea>
            <Button size="sm" mt="3" onClick={() => {document.getElementById("logo-upload").click()}} colorScheme="blue" for="logo-upload">Upload logo</Button>
            <input accept="image/*" onChange = {onSelectLogo} type ="file" hidden="true" id="logo-upload"></input>
            {createLogoPreviewURL !== null && createLogoPreviewURL !== "" && (
              <Center><Image src={createLogoPreviewURL} mt="3" w="40" h="20" objectFit="contain" pb="5"></Image></Center>
              
            )}
            
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="sm" colorScheme="red" mr={3} onClick={() => {setCreateModal(false)}}>
              Cancel
            </Button>
            <Button color="white" size="sm" colorScheme="blue" disabled={createName == "" || createCtaButton == "" || createDescription == "" || createLogoPreview == null} isLoading={createLoading} onClick={() => {createPage();}}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box bg="gray.50" minHeight="100vh" h="full" pb="7">
        <NavbarLanding shouldShowCreate={true} setCreateModal={setCreateModal} />
        {!loading && content.length == 0 && (
              <Center><Text mt="8" color="gray.500">No landing pages</Text></Center>
            )}
        <Box
          as="section"
          maxW="8xl"
          mx="auto"
          pt="12"
          mb="8"
          px={{
            base: "6",
            md: "8",
          }}
        >

          {loading && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.600"
              size="lg"
              mt="8"
            />
          )}
          <SimpleGrid
            columns={{
              base: 2,
              lg: 3,
            }}
            spacingX="6"
            mt="10"
            spacingY={{
              base: "6",
            }}
          >
            {content.map((card) => (
              <Box
                bg="white"
                border="1px solid #DDDDDD"
                borderRadius="lg"
                p={{ base: "4", md: "6" }}
              >
                <Stack spacing="5">
                  <Stack spacing="1">
                    <Image src={card.logo} w="40" h="20" objectFit="contain" pb="5"></Image>
                    <Heading size="md">{card.name}</Heading>
                    <Text fontSize="sm" color="muted">
                      Created on {months[card.month]} {card.date}, {card.year}
                    </Text>
                    <Text fontSize="sm" color="blue.500">
                      <Link href={"/page/" + card.id} target="_blank ">
                      {window.location.host + "/page/" + card.id}
                      </Link>
                    </Text>
                  </Stack>
                  <Stack direction={{ base: "column", md: "row" }} spacing="3">
                    <Button variant="outline" colorScheme="red" size ="sm" onClick={() => {
                      setDeleteModal(true);
                      setDeleteID(card.id);
                    }}>
                      Delete
                    </Button>
                    <Button
                      onClick={() => {
                        router.push("/edit/" + card.id);
                      }}
                      color="white"
                      size ="sm"
                      colorScheme="blue"
                    >
                      Edit
                    </Button>

                    <Button
                      onClick={() => {
                        window.open( window.location.protocol + "//" + window.location.host + "/page/" + card.id, "_blank");
                      }}
                      color="white"
                      size ="sm"
                      colorScheme="teal"
                    >
                      Visit
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </>
  );
}
