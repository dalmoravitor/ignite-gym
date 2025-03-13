import { NavigationContainer, DefaultTheme } from "@react-navigation/native";


import { useAuth } from "@hooks/useAuth";
import { AuthContext } from "../context/AuthContext";
import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";

import { gluestackUIConfig } from "../../config/gluestack-ui.config"

import { Box } from "@gluestack-ui/themed";
import { useContext } from "react";


export function Routes() {
    const {user} = useAuth()
    const contextData = useContext(AuthContext)
    console.log('USUÁRIO LOGADO -->  ', user)
    const theme  = DefaultTheme
    theme.colors.background = gluestackUIConfig.tokens.colors.gray700
    return (
        <Box flex={1} bg="$gray700">
            <NavigationContainer theme={theme}>
                <AuthRoutes />
            </NavigationContainer>
        </Box>
    )
}