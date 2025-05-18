import { Button } from "../components/Button/Button";
import { Input } from "@components/Input/Input";
import { ScreenHeader } from "@components/ScreenHeader";
import { UserPhoto } from "@components/UserPhoto";
import { Center, Heading, Text, VStack, useToast } from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { ToastMessage } from "@components/ToastMessage";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@hooks/useAuth";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import defaultAvatar from "@assets/userPhotoDefault.png"


type ProfileFormData = {
  name: string;
  email: string;
  old_password?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
};

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome"),
  email: yup.string().email("E-mail inválido").required("Informe o e-mail"),
  old_password: yup.string().nullable()
    .transform((value) => (!!value ? value : null)),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 dígitos.")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirmPassword: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), null], "A confirmação de senha não confere.")
    .when('password', {
        is: (Field: any) => Field,
        then: (schema) => schema.required("Confirme a nova senha").transform((value) => (!!value ? value : null)),
        otherwise: (schema) => schema.nullable(),
    }),
});

export function Profile() {
    const [isUpdating, setIsUpdating] = useState(false);

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
    resolver: yupResolver(profileSchema),
  });

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        quality: 1,
        allowsEditing: true,
        aspect: [4, 4],
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoURI = photoSelected.assets[0].uri;

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number;
        };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                action="error"
                id={id}
                title="Essa imagem é muito grande."
                description="Escolha uma de até 5MB"
                onClose={() => toast.close(id)}
              />
            ),
          });
        }

        const fileExtension = photoURI.split(".").pop();
        const photoFile = {
            name: `${user.name}-photo.${fileExtension}`.toLowerCase(),
            uri: photoURI,
            type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;
        
        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch('/users/avatar/', userPhotoUploadForm, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        updateUserProfile(userUpdated)

        toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                action="success"
                id={id}
                title="Sua imagem foi atualizada."
                onClose={() => toast.close(id)}
              />
            ),
          });

      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleProfileUpdate(data: ProfileFormData) {
    try {
        setIsUpdating(true)
        const userUpdated = user
        userUpdated.name = data.name
        await api.put('/users', data)

        await updateUserProfile(userUpdated)

        toast.show({
          placement: "top",
          render: ({ id }) => (
            <ToastMessage
              action="success"
              id={id}
              title="Suas informações foram atualizadas com sucesso."
              onClose={() => toast.close(id)}
            />
          ),
        });

    } catch (error) {
        const isAppError = error instanceof AppError;
        const title = isAppError ? error.message : "Não foi possível atualizar as informações.";

        toast.show({
          placement: "top",
          render: ({ id }) => (
            <ToastMessage
              action="error"
              id={id}
              title={title}
              description="Tente novamente mais tarde."
              onClose={() => toast.close(id)}
            />
          ),
        });
    } finally {setIsUpdating(false)}
 }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <UserPhoto size="xl" alt="foto do usuário" source={user.avatar ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : defaultAvatar} />
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="$green500" fontFamily="$heading" fontSize="$md" mt="$2" mb="$8">
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  errorMessage={errors.name?.message}
                  placeholder="Nome"
                  bg="$gray600"
                  onChangeText={onChange}
                  value={value || ''}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="E-mail"
                  bg="$gray600"
                  isReadOnly
                  onChangeText={onChange}
                  value={value || ''}
                />
              )}
            />

            <Heading
              alignSelf="flex-start"
              fontFamily="$heading"
              color="$gray200"
              fontSize="$md"
              mt="$12"
              mb="$2"
            >
              Alterar senha
            </Heading>
          </Center>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="old_password"
              render={({ field: { onChange } }) => (
                <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry onChangeText={onChange} />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  errorMessage={errors.password?.message}
                  placeholder="Nova senha"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                />
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <Input
                  errorMessage={errors.confirmPassword?.message}
                  placeholder="Confirme a nova senha"
                  bg="$gray600"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value || ''}
                />
              )}
            />
            <Button isLoading={isUpdating} title="Atualizar" onPress={handleSubmit(handleProfileUpdate)} />
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
