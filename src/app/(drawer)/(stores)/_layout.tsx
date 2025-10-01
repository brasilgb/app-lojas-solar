import React from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import StackHeader from '@/components/StackHeader'

export default function StoresLlayout() {
    const params = useLocalSearchParams();
    const dataStore = params as any;
    return (
        <Stack
            screenOptions={{
                // headerShown: true,
                // header: () => <StackHeader />
            }}
        >
            <Stack.Screen
                name='index'
                options={{
                    header: () => <StackHeader drawer otherRoute={() => router.push({
                        pathname: '/store-list',
                        params: dataStore
                    })}
                    />,
                    headerShown: true,
                    title: 'Lojas solar próximas',
                }}
            />

            <Stack.Screen
                name='store-selected'
                options={{
                    header: () => <StackHeader back />,
                    headerShown: true,
                }}
            />

            <Stack.Screen
                name='store-list'
                options={{
                    headerShown: true,
                    header: () => <StackHeader back />
                }}
            />
        </Stack>
    )
}