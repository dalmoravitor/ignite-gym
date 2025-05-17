import { UserDTO } from "@dtos/UserDTO";
import { createContext, ReactNode, useState } from "react";
import { useEffect } from "react";

import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from "@storage/storageAuthToken";
import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";

import { api } from "@services/api";
import { set } from "@gluestack-style/react";

export type AuthContextDataProps = {
    user: UserDTO
    updateUserProfile: (userUpdated: UserDTO) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    isLoadingUserStorageData: boolean
}

type AuthContextProviderProps = {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider( { children }: AuthContextProviderProps) {
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)
    const [user, setUser] = useState<UserDTO>({} as UserDTO)

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(userData)
    }

    async function signIn(email: string, password: string) {
        try {
            const {data} = await api.post('/sessions', {email, password})

            if (data.user && data.token) {
                setIsLoadingUserStorageData(true)
                await storageUserSave(data.user)
                await storageAuthTokenSave(data.token)

                userAndTokenUpdate(data.user, data.token)
            }
        }
         catch (error) {
            throw error
        } 
        finally {setIsLoadingUserStorageData(false) }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true)
            setUser({} as UserDTO)
            await storageUserRemove()
            await storageAuthTokenRemove()
        } catch (error) {
            throw error
        } finally { setIsLoadingUserStorageData(false) }
    }

    async function updateUserProfile(userUpdated: UserDTO) {
        try {
            setUser(userUpdated)
            await storageUserSave(userUpdated)
        } catch (error) {
            throw error
            
        }
    }

    async function loadUserData() {
        try {
            setIsLoadingUserStorageData(true)
            const userLogged = await storageUserGet()
            const token = await storageAuthTokenGet()

            if (token && userLogged) {
                userAndTokenUpdate(userLogged, token)
            }

        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    useEffect(() => {
        loadUserData()
    }, [])
    return (
        <AuthContext.Provider value={{ user, updateUserProfile, signIn, signOut, isLoadingUserStorageData }}>
                  {children}
                </AuthContext.Provider>
    )
}