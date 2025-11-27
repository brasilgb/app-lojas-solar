import '@/styles/global.css';
import notifee, { AndroidBadgeIconType, AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useRef } from 'react';
import { Alert, Linking, Platform } from 'react-native';

import AppLoading from '@/components/app-loading';
import { AuthProvider } from '@/contexts/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import serviceapp from '@/services/serviceapp';
import {
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    useFonts,
} from '@expo-google-fonts/roboto';

messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
    try {
        console.log('📩 [BACKGROUND] Mensagem recebida:', remoteMessage);

        const data = remoteMessage?.data || {};
        const notif = remoteMessage?.notification || {};

        // 1) TÍTULO
        const title =
            data.title ||
            notif.title ||
            'Notificação';

        // 2) CORPO
        const body =
            data.body ||
            notif.body ||
            '';

        // 3) IMAGEM — a ordem correta de prioridade
        let imageUrl: string | undefined = undefined;

        if (typeof data.image === 'string' && data.image) {
            imageUrl = data.image;
        } else if (typeof (notif as any).image === 'string' && (notif as any).image) {
            imageUrl = (notif as any).image;
        } else if (
            remoteMessage?.notification?.android?.imageUrl &&
            typeof remoteMessage.notification.android.imageUrl === 'string'
        ) {
            imageUrl = remoteMessage.notification.android.imageUrl;
        }

        // 4) URL
        const urlValue =
            typeof data.url === 'string' && data.url
                ? data.url
                : undefined;

        // 5) Mostrar notificação local com Notifee
        await fireNotification({
            title,
            body,
            image: imageUrl,
            url: urlValue,
        });

        // 6) Se existir URL, tentar abrir (alguns devices não permitem background)
        if (urlValue) {
            try {
                await Linking.openURL(urlValue);
            } catch (err) {
                // salva para abrir quando o app iniciar
                await AsyncStorage.setItem('pendingNotificationUrl', urlValue);
            }
        }

    } catch (err) {
        console.log('Erro no background handler:', err);
    }
});


// registerDevice: envia deviceId + pushToken ao backend
async function registerDevice(currentDeviceId: string, pushToken: any) {
    try {
        const deviceos = Platform.OS;
        const versaoapp = process.env.EXPO_PUBLIC_APP_VERSION?.replace(/\./g, '');

        if (__DEV__) console.log(`Tentando registrar dispositivo: ID=${currentDeviceId}`);

        const encodedDeviceId = encodeURIComponent(currentDeviceId);
        const encodedPushToken = encodeURIComponent(String(pushToken));
        const encodedVersao = encodeURIComponent(String(versaoapp || ''));

        const response = await serviceapp.get(
            `(WS_GRAVA_DEVICE)?deviceId=${encodedDeviceId}&pushToken=${encodedPushToken}&deviceOs=${deviceos}&versaoApp=${encodedVersao}`,
        );

        if (__DEV__) console.log('Dispositivo registrado com sucesso:', response.data.resposta);
    } catch (err) {
        if (__DEV__) console.error('Falha ao registrar o dispositivo:', err);
    }
}

async function registerForPushNotificationsAsync() {
    try {
        if (__DEV__) {
            if (Platform.OS === 'android' || Platform.OS === 'ios') {
                console.log('Checando ambiente: se estiver usando Expo Go, use build nativo para push completo.');
            }
        }

        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
            if (__DEV__) console.log('Permissão de notificação negada pelo usuário.');
            return null;
        }

        try { await notifee.requestPermission(); } catch (e) { if (__DEV__) console.log('notifee.requestPermission() falhou:', e); }

        try { await messaging().registerDeviceForRemoteMessages(); } catch (regRemoteErr) { if (__DEV__) console.log('Aviso registerDeviceForRemoteMessages falhou:', regRemoteErr); }

        let fcmToken: string | null = null;
        try { fcmToken = await messaging().getToken(); if (__DEV__) console.log('FCM Token:', fcmToken); } catch (err) { if (__DEV__) console.log('Erro obtendo FCM token:', err); }

        if (Platform.OS === 'android') {
            try {
                await notifee.createChannel({
                    id: 'important',
                    name: 'NotificacoesImportantes',
                    importance: AndroidImportance.HIGH,
                });
            } catch (e) { if (__DEV__) console.log('Erro criando channel notifee:', e); }
        }

        try {
            let currentDeviceId = await AsyncStorage.getItem('deviceid');
            if (!currentDeviceId) {
                const uniqueId = await DeviceInfo.getUniqueId();
                if (uniqueId) {
                    await AsyncStorage.setItem('deviceid', uniqueId);
                    currentDeviceId = uniqueId;
                }
            }

            if (currentDeviceId && fcmToken) {
                await registerDevice(currentDeviceId, fcmToken);
            }
        } catch (regErr) { if (__DEV__) console.log('Erro registrando device/token:', regErr); }

        return fcmToken;
    } catch (err) {
        if (__DEV__) console.log('Erro em registerForPushNotificationsAsync:', err);
        return null;
    }
}

// Utilitário para exibir notificação rica via notifee (Android BIGPICTURE + iOS attachments)
// Utilitário para exibir notificação rica via notifee (Android BIGPICTURE + iOS attachments)
async function fireNotification(message: { title?: string; body?: string; image?: string; url?: string }) {
    try {
        try { await notifee.requestPermission(); } catch (e) { if (__DEV__) console.log('notifee.requestPermission() (fireNotification) falhou:', e); }

        const channelId = await notifee.createChannel({
            id: 'important',
            name: 'NotificacoesImportantes',
            importance: AndroidImportance.HIGH,
        });

        let localImageUri: string | undefined;
        
        // ----------------------------------------------------------------------------------
        // ATENÇÃO: TRECHO AJUSTADO (Remoção do FileSystem.downloadAsync)
        // No background, tentar baixar a imagem é um ponto de falha.
        // Vamos confiar que a URL remota (message.image) será usada diretamente pelo Notifee.
        if (message.image) {
            // Em vez de baixar, usaremos a URL remota como o "localImageUri" para os anexos,
            // ou, se for um cenário de foreground, o Notifee pode tentar gerenciar a URL.
            // Para simplificar e evitar falha no background, não faremos o download aqui.
             localImageUri = message.image;
        }
        // ----------------------------------------------------------------------------------

        const androidStyle: any = message.image
            ? { type: AndroidStyle.BIGPICTURE, picture: message.image } // Usando a URL original
            : undefined;

        const androidOptions: any = {
            channelId,
            ...(androidStyle ? { style: androidStyle } : {}),
            badgeIconType: AndroidBadgeIconType.SMALL,
            importance: AndroidImportance.HIGH,
            pressAction: { id: 'important' },
            // smallIcon: 'ic_stat_name', // <-- você deve criar esse recurso no Android
        };

        if (message.image) {
            // Ainda passando a imagem como largeIcon se houver
            androidOptions.largeIcon = message.image;
        }

        await notifee.displayNotification({
            title: message.title,
            body: message.body,
            data: { url: message.url || '' },
            android: androidOptions,
            ios: {
                foregroundPresentationOptions: {
                    badge: true,
                    sound: true,
                    banner: true,
                    list: true,
                },
                // Passando a URL da imagem diretamente para o attachment
                attachments: message.image ? [{ url: message.image }] : [], 
            },
        });
    } catch (e) {
        if (__DEV__) console.log('Erro notifee:', e);
    }
}

const RootLayout: React.FC = () => {
    const [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_500Medium,
        Roboto_700Bold,
    });

    const firebaseForegroundListener = useRef<(() => void) | null>(null);

    useEffect(() => {
        registerForPushNotificationsAsync();

        (async () => {
            try {
                const pending = await AsyncStorage.getItem('pendingNotificationUrl');
                if (pending) {
                    if (__DEV__) console.log('Opening pendingNotificationUrl from storage:', pending);
                    Linking.openURL(pending).catch(err => { if (__DEV__) console.log('Erro abrindo pending URL:', err); });
                    await AsyncStorage.removeItem('pendingNotificationUrl');
                }
            } catch (e) {
                if (__DEV__) console.log('Erro checando pendingNotificationUrl:', e);
            }
        })();

        firebaseForegroundListener.current = messaging().onMessage(async remoteMessage => {
            if (__DEV__) console.log('Firebase: Notificação FCM recebida (Foreground):', remoteMessage);

            // Preferir dados (data) — compatível com data-only payload do backend
            const data = remoteMessage?.data || {};
            const notif = remoteMessage?.notification || {};
            const title = data.title || notif.title || 'Notificação';
            const body = data.body || notif.body || '';
            let imageUrl: string | undefined;

            // preferir data.image, depois notification.image, depois android.notification.imageUrl
            if (typeof data.image === 'string' && data.image) imageUrl = data.image;
            else if (typeof (notif as any).image === 'string' && (notif as any).image) imageUrl = (notif as any).image;
            else if (remoteMessage?.notification?.android?.imageUrl) imageUrl = remoteMessage.notification.android.imageUrl;

            const urlValue = typeof data.url === 'string' && data.url ? data.url : undefined;

            await fireNotification({ title, body, image: imageUrl, url: urlValue } as any);
        });

        (async () => {
            try {
                const remoteMessage = await messaging().getInitialNotification();
                if (remoteMessage) {
                    if (__DEV__) console.log('Firebase: App aberto a partir da notificação (Quit):', remoteMessage);
                    const url = remoteMessage?.data?.url as string;
                    if (url) {
                        Linking.openURL(url).catch(err => { if (__DEV__) console.log('Erro abrindo URL inicial:', err); });
                    }
                }
            } catch (e) {
                if (__DEV__) console.log('Erro ao checar getInitialNotification:', e);
            }
        })();

        // Notifee: abrir link quando notificação for pressionada (foreground)
        const notifeeUnsub = notifee.onForegroundEvent(({ type, detail }) => {
            if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
                const url = detail?.notification?.data?.url;
                if (url && typeof url === 'string') {
                    Linking.openURL(url).catch(err => { if (__DEV__) console.log('Erro abrindo URL (notifee):', err); });
                }

                try {
                    const notifId = detail?.notification?.id;
                    if (notifId) {
                        notifee.cancelNotification(notifId).catch(() => { });
                    }
                } catch (e) {
                    if (__DEV__) console.log('Erro cancelando notificação (foreground):', e);
                }
            }
        });

        return () => {
            notifeeUnsub && notifeeUnsub();
            if (firebaseForegroundListener.current) {
                firebaseForegroundListener.current();
            }
        };
    }, []);

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

export default RootLayout;
