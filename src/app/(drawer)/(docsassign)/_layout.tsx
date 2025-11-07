import {View, Text} from 'react-native';
import React from 'react';
import {Stack} from 'expo-router';
import StackHeader from '@/components/StackHeader';

const DocsAssignLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="docsassign"
                options={{
                    header: () => <StackHeader drawer />,
                    headerShown: true,
                    title: 'Assinar Documentos',
                }}
            />

            <Stack.Screen
                name="view-doc"
                options={{
                    header: () => <StackHeader close="/docsassign" />,
                    headerShown: true,
                    title: 'Visualizar Documento',
                }}
            />
        </Stack>
    );
};

export default DocsAssignLayout;
