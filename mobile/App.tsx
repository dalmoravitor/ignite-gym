import { StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './config/gluestack-ui.config';
import { Loading } from '@components/Loading';

import { Routes } from '@routes/index';
import { AuthContextProvider } from './src/context/AuthContext';
import { api } from "@services/api";


api.registerInterceptTokenManager(() => {
  console.log("User signed out due to token expiration.");
});

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <GluestackUIProvider config={config}>
      <StatusBar barStyle={'light-content'} backgroundColor='transparent ' translucent  />


      <AuthContextProvider>
        {fontsLoaded ? <Routes /> : <Loading />}
      </AuthContextProvider>

    </GluestackUIProvider>
  );
}

