import { UserPhoto } from "@components/UserPhoto"
import { Heading, HStack, VStack, Text, Icon } from "@gluestack-ui/themed"
import { LogOut } from "lucide-react-native"

export function HomeHeader() {
    return(
        <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
            <UserPhoto source={{uri: "https://github.com/dalmoravitor.png"}} alt="foto do usuário" h="$16" w="$16"/>
            <VStack flex={1}>
                <Text color="$gray100" fontSize="$sm">Olá,</Text>
                <Heading color="$gray100" fontSize="$md">Vitor Dal Mora</Heading>
            </VStack>
            <Icon as={LogOut} color="$gray200" size="xl"/>
        </HStack>
    )
}
