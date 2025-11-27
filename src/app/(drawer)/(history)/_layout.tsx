import {View, Text} from 'react-native';
import React from 'react';
import {Stack} from 'expo-router';
import StackHeader from '@/components/StackHeader';

const HistoryLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name="history"
                options={{
                    header: () => <StackHeader drawer />,
                    headerShown: true,
                    title: 'Assinar Documentos',
                }}
            />

            <Stack.Screen
                name="history-itens"
                options={{
                    header: () => <StackHeader back />,
                    headerShown: true,
                    title: 'Visualizar Documento',
                }}
            />
        </Stack>
    );
};

export default HistoryLayout;
