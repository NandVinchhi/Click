import React from 'react';
import {
    IconButton,
    Divider,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    useDisclosure
  } from '@chakra-ui/react';
  import {
    FiBell
  } from 'react-icons/fi';
import NotificationItem from './NotificationItem';

const Notification = ({ }) => {
    const { isOpen, onToggle, onClose } = useDisclosure()

    return (
        <Popover onClose={onClose}>
            <PopoverTrigger>
            <IconButton
                size="lg"
                variant="ghost"
                aria-label="open menu"
                icon={<FiBell />}
                onClick={onToggle}
                bg={isOpen ? "gray.100" : "white"}
            />
            </PopoverTrigger>
            <PopoverContent width="sm">
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Notifications</PopoverHeader>
            <PopoverBody>
                <NotificationItem />
                <Divider />
                <NotificationItem />
                <Divider />
                <NotificationItem />
            </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}


export default Notification