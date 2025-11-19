import React from 'react';
import {router, Stack} from 'expo-router';
import StackHeader from '@/components/StackHeader';

const AuthLayout = () => {
    return (
        <Stack
            initialRouteName="not-registered"
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_bottom',
            }}
        >
            <Stack.Screen
                name="sign-in"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="check-password"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="register-customer"
                options={{
                    headerShown: true,
                    header: () => (
                        <StackHeader left={true} />
                    ),
                }}
            />

            <Stack.Screen
                name="not-registered"
                options={{
                    headerShown: true,
                    header: () => (
                        <StackHeader
                            right={true}
                        />
                    ),
                }}
            />

            <Stack.Screen
                name="register-password"
                options={{
                    headerShown: true,
                    header: () => (
                        <StackHeader
                            right={true}
                        />
                    ),
                }}
            />

            <Stack.Screen
                name="registered"
                options={{
                    headerShown: true,
                    header: () => (
                        <StackHeader
                            right={true}
                        />
                    ),
                }}
            />

            <Stack.Screen
                name="password-changed"
                options={{
                    headerShown: true,
                    header: () => (
                        <StackHeader
                            right={true}
                        />
                    ),
                }}
            />
        </Stack>
    );
};

export default AuthLayout;
