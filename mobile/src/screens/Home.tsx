import { ExerciseCard } from '@components/ExerciseCard'
import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader/HomeHeader'
import { Heading, HStack, Text, useToast, VStack } from '@gluestack-ui/themed'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useEffect, useState, useCallback } from 'react'
import { FlatList } from 'react-native'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { Toast } from '@gluestack-ui/themed'
import { ToastMessage } from '@components/ToastMessage'

import type { ExerciseDTO } from '@dtos/ExerciseDTO'
import { Loading } from '@components/Loading'

export function Home() {
  const [isLoading, setIsLoading] = useState(true)

  const toast = useToast()
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])
  const [groups, setGroups] = useState<string[]>([])
  const [groupSelected, setGroupSelected] = useState('antebraço')
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate("exercise", {exerciseId})
  }

  async function fetchGroup() {
    try {
      const response = await api.get('/groups')
      setGroups(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar os grupos musculares."
      
      toast.show({
        placement: "top",
        render: () => (
          <ToastMessage action="error" title={title} id="6" onClose={() => {}} />
        ),
      })
    }
  }

  async function fetchExercisesByGroup() {
    try {
      setIsLoading(true)

      const response = await api.get<ExerciseDTO[]>(`/exercises/bygroup/${groupSelected}`)
      setExercises(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível carregar os exercícios."
      
      toast.show({
        placement: "top",
        render: () => (
          <ToastMessage action="error" title={title} id="6" onClose={() => {}} />
        ),
      })
    } finally {setIsLoading(false)}
  }

  useEffect(() => {
    fetchGroup()
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchExercisesByGroup()
    }, [groupSelected])
  )

  
  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      {
        isLoading ? <Loading /> : (
          <VStack flex={1} px="$8">
        <HStack alignItems="center" justifyContent="space-between" mb="$4">
          <Heading color="$gray200" fontSize="$md" fontFamily="$heading">
            Exercícios
          </Heading>
          <Text color="$gray200" fontSize="$sm" fontFamily="$body">
            {exercises.length}
          </Text>
        </HStack>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ExerciseCard data={item} onPress={() => handleOpenExerciseDetails(item.id)} />
          )}
        />
      </VStack>
        )

      }

      
    </VStack>
  )
}
