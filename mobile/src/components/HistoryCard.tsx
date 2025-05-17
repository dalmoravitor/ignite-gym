import { HistoryDTO } from "@dtos/HistoryDTO";
import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";

type Props = {
    data: HistoryDTO
}

export function HistoryCard({data}: Props) {
    return (
        <HStack w="$full" px="$5" py="$4" mb="$3" bg="$gray600" rounded="md" alignItems="center" justifyContent="space-between">
            <VStack flex={1} mr="$5">
                <Heading numberOfLines={1} color="$white" fontSize="$md" textTransform="capitalize" fontFamily="$heading">{data.group}</Heading>
                <Text color="$gray100" numberOfLines={1} fontSize="$lg">{data.name}</Text>
            </VStack>

            <Text color="$gray300" fontSize="$md">{
                (() => {
                    const [hour, minute] = data.hour.split(':').map(Number);
                    const adjustedDate = new Date();
                    adjustedDate.setHours(hour - 3, minute);
                    const adjustedHour = adjustedDate.getHours().toString().padStart(2, '0');
                    const adjustedMinute = adjustedDate.getMinutes().toString().padStart(2, '0');
                    return `${adjustedHour}:${adjustedMinute}`;
                })()
            }</Text>
        </HStack>
    )
}