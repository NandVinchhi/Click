import { Avatar, Box, Stack, StackDivider, Text, HStack, Icon } from '@chakra-ui/react'
import { BsFillStarFill } from 'react-icons/bs'

export const Testimonial = (props) => {
  const { name, quote, title } = props
  return (
    <Stack
      spacing={{
        base: '6',
        md: '8',
      }}
    >
      <HStack spacing="1.5" {...props}>
        {Array.from({
        length: 5,
        })
        .map((_, index) => index + 1)
        .map((index) => (
            <Icon
            key={index}
            as={BsFillStarFill}
            fontSize="xl"
            color={props.color + ".500"}
            _dark={{
                color: 'blue.200',
            }}
            />
        ))}
    </HStack>
      <Text
        textStyle={{
          base: 'lg',
          md: 'xl',
        }}
        fontWeight="medium"
      >
        “{quote}”
      </Text>
      <Stack
        gap="5"
        spacing="0"
        direction={{
          base: 'column',
          md: 'row',
        }}
        divider={
          <StackDivider
            display={{
              base: 'none',
              md: 'block',
            }}
          />
        }
        align={{
          base: 'flex-start',
          md: 'center',
        }}
      >
        <Stack
          spacing={{
            base: '4',
            md: '5',
          }}
          direction={{
            base: 'column',
            md: 'row',
          }}
        >
          <Box>
            <Text fontWeight="bold">{name}</Text>
            <Text color="fg.muted">
              {title}
            </Text>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  )
}