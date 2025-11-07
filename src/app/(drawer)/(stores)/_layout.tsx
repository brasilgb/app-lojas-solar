import React from 'react';
import {router, Stack} from 'expo-router';
import StackHeader from '@/components/StackHeader';

export default function StoresLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="stores"
                options={{
                    header: () => (
                        <StackHeader
                            drawer
                            otherRoute={() => router.push('/store-list')}
                        />
                    ),
                    headerShown: true,
                    title: 'Lojas solar próximas',
                }}
            />

            <Stack.Screen
                name="store-selected"
                options={{
                    header: () => <StackHeader back />,
                    headerShown: true,
                }}
            />

            <Stack.Screen
                name="store-list"
                options={{
                    headerShown: true,
                    header: () => <StackHeader back />,
                }}
            />
        </Stack>
    );
}
