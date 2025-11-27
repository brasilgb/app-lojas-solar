import { displayNotification } from '@/lib/notifications';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Linking } from 'react-native';

/**
 * Este handler é executado quando o app está em background ou fechado (quit).
 * Ele é registrado aqui, no ponto de entrada do app (index.ts), para garantir
 * que o Firebase possa executá-lo mesmo sem a UI do React Native estar ativa.
 */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Firebase: Notificação FCM recebida (Background/Quit):', remoteMessage);

  if (remoteMessage.data) {
    // Extrai os dados do payload "data-only"
    const { title, body, imageUrl, url } = remoteMessage.data;

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