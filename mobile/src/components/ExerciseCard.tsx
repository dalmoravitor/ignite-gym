import { Heading, HStack, Image, Text, VStack, Icon } from "@gluestack-ui/themed";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ChevronRight } from "lucide-react-native";

type Props = TouchableOpacityProps & {
    name: string
}

export function ExerciseCard({name, ...rest}: Props) {
    return (
        <TouchableOpacity {...rest}>
            <HStack bg="$gray500" alignItems="center" p="$2" pr="$4" rounded={"$md"} mb="$3">
                <Image rounded={"$md"} resizeMode="cover" mr="$4" h="$16" w="$16" alt="imagem do exercício" source={{uri: "https://static.wixstatic.com/media/2edbed_60c206e178ad4eb3801f4f47fc6523df~mv2.webp/v1/fill/w_350,h_375,al_c,q_80,enc_avif,quality_auto/2edbed_60c206e178ad4eb3801f4f47fc6523df~mv2.webp"}} />


                <VStack flex={1}>
                    <Heading fontSize={"$lg"} color="$white">{name}</Heading>
                    <Text fontSize={"$sm"} color="$gray200" mt="$1" numberOfLines={2}>4 séries x 12 repetições</Text>
                </VStack>
                <Icon as={ChevronRight} size="xl" color="$gray300"/>
            </HStack>
        </TouchableOpacity>
    )
}