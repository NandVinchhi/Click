import React from "react"
import {
    IconButton,
    Avatar,
    Box,
    Text,
    Menu,
    MenuButton,
    MenuItem,
    MenuList
  } from '@chakra-ui/react';
    import { EmailIcon, DeleteIcon } from '@chakra-ui/icons';
    import { SlOptions } from 'react-icons/sl';

const NotificationItem = ({ }) => {
    return(
        <Box display='flex' justifyContent="space-between" py="2">
            <Box display="flex" alignItems={"center"}>
            <Avatar size="sm" name='Dan Abrahmov' src='https://bit.ly/dan-abramov' />
            <Text fontSize="sm" px="2">Nand Vinchhi shared Series A Pitch Deck with you</Text>
            </Box>
            <Box>
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<SlOptions />}
                    variant="ghost"
                />
                <MenuList>
                    <MenuItem icon={<EmailIcon />}>Mark unread</MenuItem>
                    <MenuItem icon={<DeleteIcon />} color="red">Delete</MenuItem>
                </MenuList>
            </Menu>
            </Box>
        </Box>
    )
}

export default NotificationItem