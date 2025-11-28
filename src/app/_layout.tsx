import '@/styles/global.css';
import 'react-native-get-random-values';
import notifee, { EventType } from '@notifee/react-native';
import React, { useEffect } from 'react';
import { Linking, Platform } from 'react-native';

import AppLoading from '@/components/app-loading';
import { AuthProvider } from '@/contexts/AppContext';
import messaging from '@react-native-firebase/messaging';

import { createNotificationChannel, displayNotification } from '@/lib/notifications';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getPersistentUniqueId } from '@/utils/deviceStorage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import serviceapp from '@/services/serviceapp';

import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    useFonts,
} from '@expo-google-fonts/roboto';

/**
 * Este handler é executado quando o app está em background ou fechado (quit).
 * Ele é registrado aqui, no ponto de entrada do app (index.ts), para garantir
 * que o Firebase possa executá-lo mesmo sem a UI do React Native estar ativa.
 */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Firebase: Notificação FCM recebida (Background/Quit):', remoteMessage);

  if (remoteMessage.data) {
    // Extrai os dados do payload "data-only"
    const { title, body, imageUrl, url } = remoteMessage.data as any;

    await displayNotification({
      title,
      body,
      imageUrl,
      url,
      messageId: remoteMessage.messageId,
    });
  }
});

/**
 * Este handler é executado quando o usuário interage com uma notificação
 * e o app está em background ou fechado (quit).
 */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification } = detail;

  // Evento de clique na notificação
  if (type === EventType.PRESS && notification?.data?.url) {
    // Abre o link associado
    await Linking.openURL(notification.data.url as string);
  }
});

const RootLayout: React.FC = () => {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    });

    // Hook para inicializar e gerenciar notificações
    useNotifications();

    if (!fontsLoaded) {
        return <AppLoading />;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-solar-blue-primary">
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

/**
 * Hook customizado para encapsular toda a lógica de notificações.
 */
const useNotifications = () => {
    useEffect(() => {
        const initializeNotifications = async () => {
            // 1. Solicita permissão para notificações (iOS e Android 13+)
            await notifee.requestPermission();

            // 2. Cria o canal de notificação para Android (obrigatório)
            await createNotificationChannel();

            // 3. Obtém o token FCM e registra o dispositivo
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                console.log('Firebase: FCM Token obtido:', fcmToken);
                const deviceId = await getPersistentUniqueId();
                await registerDevice(deviceId, fcmToken);
            }

            // 4. Listener para quando o app é aberto a partir de uma notificação (estado quit)
            const initialNotification = await notifee.getInitialNotification();
            if (initialNotification && initialNotification.notification.data?.url) {
                Linking.openURL(initialNotification.notification.data.url as string);
            }
        };  

        initializeNotifications();

        // 5. Listener para notificações recebidas com o app em FOREGROUND
        const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
            console.log('Firebase: Notificação FCM recebida (Foreground):', remoteMessage);
            if (remoteMessage.data) {
                // Extrai os dados do payload "data-only"
                const { title, body, imageUrl, url } = remoteMessage.data as any;
                await displayNotification({ title, body, imageUrl, url, messageId: remoteMessage.messageId });
            }
        });

        // Limpeza dos listeners ao desmontar o componente
        return () => {
            unsubscribeOnMessage();
        };
    }, []);

    // 6. Listener para eventos de INTERAÇÃO com a notificação (app em foreground/background)
    useEffect(() => {
        const handleNotificationInteraction = (eventType: EventType, url: string | undefined) => {
            if (eventType === EventType.PRESS && url) {
                Linking.openURL(url);
            }
        };

        const unsubscribeForeground = notifee.onForegroundEvent(({ type, detail }) => {
            handleNotificationInteraction(type, detail.notification?.data?.url as string | undefined);
        });

        return () => {
            unsubscribeForeground();
        };
    }, []);
};

// registerDevice: envia deviceId + pushToken ao backend
async function registerDevice(deviceId: string, pushToken: any) {
    
        const deviceos = Platform.OS;
        const versaoapp = process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '');

        const response = await serviceapp.get(
            `(WS_GRAVA_DEVICE)?deviceId=${deviceId}&pushToken=${pushToken}&deviceOs=${deviceos}&versaoApp=${versaoapp}`,
        );
}

export default RootLayout;
