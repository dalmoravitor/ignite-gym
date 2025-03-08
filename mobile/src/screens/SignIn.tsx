import { VStack, Image, Center, Text, Heading, ScrollView } from "@gluestack-ui/themed"

import BackGroundImage from '@assets/background.png'
import  Logo from '@assets/logo.svg'
import { Input } from "@components/Input/Input"
import { Button } from "@components/Button/Button"
import { useNavigation } from "@react-navigation/native"

import { AuthNavigatorRoutesProps } from "@routes/auth.routes"

export function SignIn() {
    const navigator = useNavigation<AuthNavigatorRoutesProps>();

    function goToSignUp() {
        navigator.navigate('signUp')
    }


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
            <VStack flex={1}>
                <Image
                    w="$full"
                    h={624}
                    source={BackGroundImage}
                    defaultSource={BackGroundImage}
                    position="absolute"
                    alt="imagem do background"
                />
                <VStack flex={1} px="$10" pb="$16">
                    <Center my="$24">
                        <Logo />
                        <Text color="$gray100" fontSize="$sm">Treine sua mente e seu corpo</Text>
                    </Center>
                    <Center gap="$2">
                        <Heading color="$gray100">Acesse a conta</Heading>
                        <Input placeholder="E-mail" keyboardType="email-address" autoCapitalize="none"/>
                        <Input placeholder="Senha" secureTextEntry />
                        <Button title="Acessar"  />
                    </Center>
                    <Center flex={1} justifyContent="flex-end" mt="$4">
                        <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="Body">Ainda não tem acesso?</Text>
                        <Button onPress={goToSignUp} title="Criar conta" variant="outline" />
                    </Center>
                </VStack>
            </VStack>
        </ScrollView>
    )
}