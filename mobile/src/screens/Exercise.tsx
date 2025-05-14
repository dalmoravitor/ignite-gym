import { VStack, Icon, HStack, Heading, Text, Image, Box, set } from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import BodySVG from "@assets/body.svg"
import SeriesSVG from "@assets/series.svg"
import RepetitionsSVG from "@assets/repetitions.svg"
import { Button } from "@components/Button/Button";
import { api } from "@services/api";
import {AppError} from "@utils/AppError";
import { ToastMessage } from "@components/ToastMessage";
import { useToast } from "@gluestack-ui/themed";
import { ExerciseDTO } from "@dtos/ExerciseDTO";
import { Loading } from "@components/Loading";

type RouteParamsProps = {
    exerciseId: string
}

export function Exercise( ) {
    const [isLoading, setIsLoading] = useState(true)
    const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
    const toast = useToast()
    const navigation = useNavigation<AppNavigatorRoutesProps>()
    const route = useRoute()
    const { exerciseId } = route.params as RouteParamsProps

    async function fetchExerciseDetails() {
        try {
            setIsLoading(true)
            const response = await api.get(`/exercises/${exerciseId}`)
            setExercise(response.data)
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError ? error.message : "Não foi possível carregar os detalhes do exercício."

            toast.show({
                placement: "top",
                render: () => (
                    <ToastMessage action="error" title={title} id="6" onClose={() => {}} />
                ),
            })
        } finally {setIsLoading(false)}
    }


    function handleGoBack() {
        navigation.goBack()
    }

    useEffect(() => {
        fetchExerciseDetails()
    }, [exerciseId])


    return(
        <VStack flex={1}>
            <VStack px="$8" bg="$gray600" pt="$12">
                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={ArrowLeft} color="$green500" size="xl"/>
                </TouchableOpacity>
                <HStack 
                    justifyContent="space-between"
                    alignItems="center"
                    mt="$4"
                    mb="$8">
                    <Heading color="$gray100" fontFamily="$heading" fontSize="$lg" flexShrink={1}>{exercise.name}</Heading>
                   
                    <HStack alignItems="center">
                        <BodySVG/>
                        <Text color="$gray200" ml="$1" textTransform="capitalize">{exercise.group}</Text>
                    </HStack>
                </HStack>
            </VStack>

            

                {isLoading ? <Loading /> : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
                        <VStack p="$8">
                            <Box rounded="$lg" overflow="hidden" mb="$3">
                                <Image h="$80" w="$full"  resizeMode="cover" rounded="$lg" source={{uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}alt="exercício"/>
                            </Box>
                            <Box bg="$gray600" rounded="$md" pb="$4" px="$4">
                                <HStack justifyContent="space-around" alignItems="center" mb="$6" mt="$5">
                                    <HStack alignItems="center">
                                        <SeriesSVG />
                                        <Text color="$gray200" ml="$2">{`${exercise.series}séries`}</Text>
                                    </HStack>
                                    <HStack alignItems="center">
                                        <RepetitionsSVG />
                                        <Text color="$gray200" ml="$2">{`${exercise.repetitions} repetições`}</Text>
                                    </HStack>
                                </HStack>
                                <Button title="Marcar como feito" />
                            </Box>
                        </VStack>
                    </ScrollView>

                )}
               

            
        </VStack>
    )
}