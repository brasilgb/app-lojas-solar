import React from 'react'
import { Stack } from 'expo-router'

export default function StoresLlayout() {
    return (
        <Stack>

            <Stack.Screen
                name='index'
                options={{
                    headerShown: false,
                    title: 'Lojas solar próximas',
                }}
            />

            <Stack.Screen
                name='store-list'
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name='store-selected'
                options={{
                    headerShown: false
                }}
            />

        </Stack>
    )
}