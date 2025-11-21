import '@/styles/global.css';
import React, { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';

import AppLoading from '@/components/app-loading';
import { AuthProvider } from '@/contexts/AppContext';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    useFonts,
} from '@expo-google-fonts/roboto';

// 👉 Configuração de como lidar com notificações quando o app está aberto
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// 👉 Função para registrar push token
async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        Alert.alert('Aviso', 'Use um dispositivo físico para receber notificações.');
        return;
    }

    // Android: criar canal
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.DEFAULT, // Mais seguro para evitar problemas de permissão
        });
    }

    // Verifica permissões
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        Alert.alert('Permissão negada', 'Não foi possível obter permissão para enviar notificações.');
        return;
    }

    // Token Expo
    const tokenResponse = await Notifications.getExpoPushTokenAsync({
        projectId: '52d35a9c-4dab-4fe2-9519-1c32bba74e17',
    });

    const token = tokenResponse.data;
    console.log('Expo Push Token:', token);

    return token;
}

const RootLayout = () => {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    });

    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    useEffect(() => {
        registerForPushNotificationsAsync();

        // Recebe notificação em foreground
        notificationListener.current = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log('Notificação recebida:', notification);
            }
        );

        // Usuário tocou em uma notificação
        responseListener.current = Notifications.addNotificationResponseReceivedListener(
            (response) => {
                console.log('Resposta à notificação:', response);
            }
        );

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-solar-blue-primary">
                <StatusBar translucent style="light" />
                <AuthProvider>
                    <Stack>
                        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    </Stack>
                </AuthProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default RootLayout;
