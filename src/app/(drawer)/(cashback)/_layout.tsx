import React from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import StackHeader from '@/components/StackHeader'

export default function CashbackLayout() {
    const params = useLocalSearchParams();
    const dataStore = params as any;
    return (
        <Stack>

            <Stack.Screen
                name='cashback'
                options={{
                    header: () => <StackHeader drawer />,
                    headerShown: true,
                    title: 'Cashback',
                }}
            />
{/* 
            <Stack.Screen
                name='assistance-detail'
                options={{
                    header: () => <StackHeader back />,
                    headerShown: true,
                    title: 'Detalhes da assistência',
                }}
            /> */}

        </Stack>
    )
}