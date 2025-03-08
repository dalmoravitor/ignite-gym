import { Button, Text } from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof Button> & {
    name: string,
    isActive: boolean
}

export function Group({name, isActive, ...rest}: Props) {
    return (
        <Button
            mr="$3"
            minWidth="$24"
            h="$10"
            bg="$gray600"
            rounded="$md"
            justifyContent="center"
            alignItems="center"
            borderColor="$green600"
            borderWidth={isActive ? 1 : 0}
            sx={{
                ":active": {
                    borderWidth: 1
                },
            }}
            {...rest}
        >
            <Text 
            color={isActive ? "$green500" : "$gray200"}
            fontFamily="$heading"
            textTransform="uppercase"
            fontSize="$xs"
            
            >{name}</Text>
        </Button>
    )
}