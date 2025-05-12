import { VStack, Image, Center, Text, Heading, ScrollView } from "@gluestack-ui/themed"

import BackGroundImage from '@assets/background.png'
import  Logo from '@assets/logo.svg'
import { Input } from "@components/Input/Input"
import { Button } from "@components/Button/Button"
import { useNavigation } from "@react-navigation/native"

import { AuthNavigatorRoutesProps } from "@routes/auth.routes"
import { Controller, useForm } from "react-hook-form"

import { useAuth } from "@hooks/useAuth"
import { AppError } from "@utils/AppError"
import { useToast } from "@gluestack-ui/themed"
import { ToastMessage } from "@components/ToastMessage"
import { useState } from "react"

type FormData = {
    email: string,
    password: string
}

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    const { signIn } = useAuth()
    const navigator = useNavigation<AuthNavigatorRoutesProps>();
    const { control, handleSubmit, formState: { errors }} = useForm<FormData>()

    function goToSignUp() {
        navigator.navigate('signUp')
    }

    async function handleSignIn({email, password}: FormData) {
        try {
            setIsLoading(true)
            await signIn(email, password)

        } catch(error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível fazer login. Tente novamente mais tarde.'    
            
            setIsLoading(false)

            toast.show({
                placement: "top",
                render: () => (
                    <ToastMessage action="error" title={title} id='6' onClose={() => {}}/>
                ),
            });

        }
        
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


                        <Controller 
                            control={control}
                            name='email'
                            rules={{ required : 'Informe o email.'}}

                            render={({ field: {onChange, value}}) => (
                                <Input errorMessage={errors.email?.message} onChangeText={onChange} value={value} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none"/>
                            )}
                        />


                        <Controller 
                            control={control}
                            rules={{ required : 'Informe a senha.'}}
                            name="password"
                            render={({ field: {onChange, value}}) => (
                                <Input errorMessage={errors.password?.message}  onChangeText={onChange} value={value}  placeholder="Senha" secureTextEntry />
                            )}
                        />

                        <Button onPress={handleSubmit(handleSignIn)} title="Acessar" isLoading={isLoading} />
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