import React from 'react';
import {router, Stack, useLocalSearchParams} from 'expo-router';
import StackHeader from '@/components/StackHeader';

export default function CashbackLayout() {
    const params = useLocalSearchParams();
    const dataStore = params as any;
    return (
        <Stack>
            <Stack.Screen
                name="cashback"
                options={{
                    header: () => <StackHeader drawer />,
                    headerShown: true,
                    title: 'Cashback',
                }}
            />

            <Stack.Screen
                name="history-cashback"
                options={{
                    header: () => <StackHeader back />,
                    headerShown: true,
                    title: 'Histórico de cashback',
                }}
            />

            <Stack.Screen
                name="cashback-requested"
                options={{
                    header: () => <StackHeader close="/cashback" />,
                    headerShown: true,
                    title: 'Cashback solicitado',
                }}
            />
        </Stack>
    );
}
