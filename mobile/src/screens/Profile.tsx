import { Button } from "@components/Button/Button";
import { Input } from "@components/Input/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, Text, VStack, useToast } from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { useState } from "react";
import { ToastMessage } from "@components/ToastMessage";


export function Profile() {
    const [userPhoto, setUserPhoto] = useState("https://github.com/dalmoravitor.png")

    const toast = useToast()
    
    async function handleUserPhotoSelect() {
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                quality: 1,
                allowsEditing: true,
                aspect: [4, 4],
            })

            if(photoSelected.canceled) {
                return
            }

            const photoURI = photoSelected.assets[0].uri

            if (photoURI) {
                const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
                    size: number
                }

                if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
                    return toast.show({
                        placement: "top",
                        render: ({ id }) => (
                            <ToastMessage action="error" id={id} title="Essa imagem é muito grande." description="Escolha uma de até 5MB" onClose={() => toast.close(id)}/>
                        )
                    })
                }
                setUserPhoto(photoURI)
            
        }

        } catch {
            console.log(Error)
        }
    }


    return (
    <VStack flex={1}> 
        <ScreenHeader title="Perfil"/>

        <ScrollView contentContainerStyle={{paddingBottom: 36}}>
            <Center mt="$6" px="$10">
                <UserPhoto size="xl" alt="foto do usuário" source={{uri: userPhoto}}/>
                <TouchableOpacity onPress={handleUserPhotoSelect}>
                    <Text color="$green500" fontFamily="$heading" fontSize="$md" mt="$2" mb="$8">
                        Alterar foto
                    </Text>
                </TouchableOpacity>

                <Center w="$full" gap="$4">
                    <Input placeholder="Nome" bg="$gray600"/>
                    <Input isReadOnly={true} value="dalmoravitor@gmail.com" bg="$gray600"/>
                </Center>

                <Heading alignSelf="flex-start" fontFamily="$heading" color="$gray200" fontSize="$md" mt={"$12"} mb={"$2"}>
                    Alterar senha
                </Heading>

                <Center w="$full" gap="$4">
                    <Input placeholder="Senha anterior" bg="$gray600" secureTextEntry/>
                    <Input placeholder="Nova senha" bg="$gray600" secureTextEntry/>
                    <Input placeholder="Confirme a nova senha" bg="$gray600" secureTextEntry/>


                    <Button title="Atualizar"/>
                </Center>
            </Center>

      
        </ScrollView>
    </VStack>
    )
}