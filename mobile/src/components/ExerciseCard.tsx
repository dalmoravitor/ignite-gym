import { Heading, HStack, Image, Text, VStack, Icon } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { api } from "@services/api";


type Props = TouchableOpacityProps & {
    data: ExerciseDTO
}

export function ExerciseCard({ data, ...rest}: Props) {
    return (
        <TouchableOpacity {...rest}>
            <HStack bg="$gray500" alignItems="center" p="$2" pr="$4" rounded={"$md"} mb="$3">
                <Image rounded={"$md"} resizeMode="cover" mr="$4" h="$16" w="$16" alt="imagem do exercício" source={{uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`}} />


                <VStack flex={1}>
                    <Heading fontSize={"$lg"} color="$white">{data.name}</Heading>
                    <Text fontSize={"$sm"} color="$gray200" mt="$1" numberOfLines={2}>{data.series} séries x {data.repetitions} repetições</Text>
                </VStack>
                <Icon as={ChevronRight} size="xl" color="$gray300"/>
            </HStack>
        </TouchableOpacity>
    )
}