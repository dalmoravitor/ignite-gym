import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";

export function HistoryCard() {
    return (
        <HStack w="$full" px="$5" py="$4" mb="$3" bg="$gray600" rounded="md" alignItems="center" justifyContent="space-between">
            <VStack flex={1} mr="$5">
                <Heading numberOfLines={1} color="$white" fontSize="$md" textTransform="capitalize" fontFamily="$heading">Costas</Heading>
                <Text color="$gray100" numberOfLines={1} fontSize="$lg">Puxada frontal</Text>
            </VStack>

            <Text color="$gray300" fontSize="$md">08:56</Text>
        </HStack>
    )
}