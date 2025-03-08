import { ExerciseCard } from '@components/ExerciseCard'
import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader/HomeHeader'
import { Heading, HStack, Text, VStack } from '@gluestack-ui/themed'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useState } from 'react'
import { FlatList } from 'react-native'

export function Home() {
  const [exercises, setExercises] = useState([
    "Puxada frontal",
    "Remada curvada",
    "Remada unilateral",
    "Levantamento terra"
  ])
  const [groups, setGroups] = useState(['Costas', 'Bíceps', 'Tríceps', 'Ombro'])
  const [groupSelected, setGroupSelected] = useState('Costas')
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails() {
    navigation.navigate("exercise")
  }

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

      <VStack flex={1} px="$8">
        <HStack alignItems='center' justifyContent='space-between' mb="$4">
          <Heading color='$gray200' fontSize="$md" fontFamily='$heading'>Exercícios</Heading>
          <Text color='$gray200' fontSize={"$sm"} fontFamily='$body'>{exercises.length}</Text>
        </HStack>
        <FlatList showsVerticalScrollIndicator={false} data={exercises} keyExtractor={(item) => item} renderItem={({item}) => (
          <ExerciseCard onPress={handleOpenExerciseDetails} name={item}/>
        )}/>
      </VStack>
    </VStack>
  )
}