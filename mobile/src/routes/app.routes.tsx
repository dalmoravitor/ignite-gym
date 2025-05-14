import { createBottomTabNavigator, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { Exercise } from "@screens/Exercise";
import { History } from "@screens/History";
import { Home } from "@screens/Home";
import { Profile } from "@screens/Profile";

import { gluestackUIConfig } from "../../config/gluestack-ui.config";

import HomeSVG from '@assets/home.svg'
import HistorySVG from '@assets/history.svg'
import ProfileSVG from '@assets/profile.svg'
import { Platform } from "react-native";

type AppRoutes = {
    home: undefined,
    history: undefined,
    profile: undefined,
    exercise: {
        exerciseId: string
    }
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const {Navigator, Screen} = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
    const {tokens} = gluestackUIConfig
    const iconSize = tokens.space["6"]
    return (
        <Navigator screenOptions={{ 
            headerShown: false, 
            
            tabBarShowLabel: false, 
            tabBarActiveTintColor: tokens.colors.green500, 
            tabBarInactiveTintColor: tokens.colors.gray200,
            tabBarStyle: {
                backgroundColor: tokens.colors.gray600,
                borderTopWidth: 0,
                height: Platform.OS === 'android' ? 'auto' : 96,
                paddingBottom: tokens.space['10'],
                paddingTop: tokens.space['6'],
              },
            
        }}
            
            >
            <Screen name="home" options={{tabBarIcon: ({color}) => <HomeSVG fill={color} width={iconSize} height={iconSize}/>}} component={Home}/>
            <Screen name="history" options={{tabBarIcon: ({color}) => <HistorySVG fill={color} width={iconSize} height={iconSize}/>}} component={History}/>
            <Screen name="profile" options={{tabBarIcon: ({color}) => <ProfileSVG fill={color} width={iconSize} height={iconSize}/>}} component={Profile}/>
            <Screen name="exercise" component={Exercise} options={{tabBarButton: () => null, tabBarItemStyle: {
            display: 'none' // este estilo
          }}}/>

        </Navigator>
    )
}