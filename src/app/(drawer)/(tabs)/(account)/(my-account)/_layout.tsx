import {View, Text} from 'react-native';
import React from 'react';
import {Stack} from 'expo-router';

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="my-account"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="data-exclude"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="data-analise"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
};

export default Layout;
