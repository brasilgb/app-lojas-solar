import React from 'react';
import {router, Stack, useLocalSearchParams} from 'expo-router';
import StackHeader from '@/components/StackHeader';

export default function CrediaryLayout() {
    const params = useLocalSearchParams();
    const dataStore = params as any;
    return (
        <Stack>
            <Stack.Screen
                name="crediary"
                options={{
                    header: () => <StackHeader drawer />,
                    headerShown: true,
                    title: 'Crediário',
                }}
            />

            <Stack.Screen
                name="load-images"
                options={{
                    header: () => <StackHeader back />,
                    headerShown: true,
                    title: 'Imagens e Documentos',
                }}
            />

            <Stack.Screen
                name="images-sent"
                options={{
                    header: () => <StackHeader back />,
                    headerShown: true,
                    title: 'Imagens enviadas',
                }}
            />
        </Stack>
    );
}
