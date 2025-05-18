import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from "@gluestack-ui/themed"

import BackGroundImage from '@assets/background.png'
import  Logo from '@assets/logo.svg'

import { Input } from "@components/Input/Input"
import { Button } from "@components/Button/Button"

import { AuthNavigatorRoutesProps } from "@routes/auth.routes"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useTheme } from "@gluestack-ui/themed"
import axios from "axios"
import { api } from "@services/api"
import { Alert } from "react-native"
import { AppError } from "@utils/AppError"
import { ToastMessage } from "@components/ToastMessage"
import { useAuth } from "@hooks/useAuth"

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    senhaconfirm: string;
}


const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o email').email('Email inválido'),
    password: yup.string().required('Informe a senha').min(6, 'A senha deve ter no mínimo 6 caracteres.'),
    senhaconfirm: yup.string().required('Confirme a senha').oneOf([yup.ref("password"), ""], "As senhas não conferem.")
})

export function SignUp() {
    const [isLoading, setIsLoading] = useState(false)
    const {singIn} = useAuth()
    const toast = useToast()
    const { control, handleSubmit, formState: { errors} } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    })

    


    const navigator = useNavigation<AuthNavigatorRoutesProps>();
    
    function goToSignIn() {
        navigator.navigate('signIn')
    }

    async function handleSignUp({ name, email, password }: FormDataProps) {
        try {
            setIsLoading(true)

            await api.post('/users', { name, email, password });
            await singIn(email, password)
            
        } catch (error) {
            setIsLoading(false)
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível criar a conta, tente novamente mais tarde.'


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
            <VStack flex={1} >
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
                    <Center flex={1} gap="$2">
                        <Heading color="$gray100">Crie sua conta</Heading>

                        <Controller 
                            control={control}
                            name="name"
                            
                            render={({ field: {onChange, value}}) => (
                                <Input value={value} errorMessage={errors.name?.message} onChangeText={onChange} placeholder="Nome"  />
                            )}
                        />

                        <Controller 
                            control={control}
                            name='email'
                            
                            render={({ field: {onChange, value}}) => (
                                <Input errorMessage={errors.email?.message} onChangeText={onChange} value={value} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none"/>
                            )}
                        />


                        <Controller 
                            control={control}
                            name="password"
                            render={({ field: {onChange, value}}) => (
                                <Input errorMessage={errors.password?.message}  onChangeText={onChange} value={value}  placeholder="Senha" secureTextEntry />
                            )}
                        />

                        <Controller 
                            control={control}
                            name="senhaconfirm"
                            render={({ field: {onChange, value}}) => (
                                <Input errorMessage={errors.senhaconfirm?.message} onSubmitEditing={handleSubmit(handleSignUp)} returnKeyType="send" onChangeText={onChange} value={value} placeholder="Confirme a senha" secureTextEntry />
                            )}
                        />

                       

                        <Button onPress={handleSubmit(handleSignUp)} title="Criar e acessar" isLoading={isLoading}  />
                    </Center>
                        <Button onPress={goToSignIn} mt="$12" title="Voltar para o login" variant="outline" />
                  
                </VStack>
            </VStack>
        </ScrollView>
    )
}