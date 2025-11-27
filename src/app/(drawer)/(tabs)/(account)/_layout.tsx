import {Tabs} from 'expo-router';
import {RotateCcwKeyIcon, UserIcon} from 'lucide-react-native';
import React from 'react';

function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: '#1a9cd9',
                tabBarActiveBackgroundColor: '#1a9cd9',
                tabBarInactiveBackgroundColor: '#FFFFFF',
                tabBarStyle: {
                    height: 60,
                    paddingTop: 0,
                    paddingBottom: 0,
                    backgroundColor: '#1a9cd9',
                    borderTopWidth: 0,
                    shadowColor: '#000',
                },
                tabBarItemStyle: {
                    paddingTop: 0,
                    paddingBottom: 0,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="(my-account)"
                options={{
                    title: 'Dados da Conta',
                    tabBarIcon: ({color, size}) => (
                        <UserIcon color={color} size={size} />
                    ),
                }}
            />

            <Tabs.Screen
                name="change-password"
                options={{
                    title: 'Alterar minha senha',
                    tabBarIcon: ({color, size}) => (
                        <RotateCcwKeyIcon color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}

export default TabsLayout;
