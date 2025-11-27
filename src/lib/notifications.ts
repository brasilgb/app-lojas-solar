import notifee, {
    AndroidImportance,
    AndroidStyle,
    AndroidVisibility,
} from '@notifee/react-native';

export interface NotificationPayload {
  title?: string;
  body?: string;
  imageUrl?: string;
  url?: string;
  messageId?: string;
}

/**
 * Cria o canal de notificação necessário para Android 8.0+.
 * Deve ser chamado uma vez, quando o app inicia.
 */
export async function createNotificationChannel() {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Canal Padrão',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
  });
  return channelId;
}

/**
 * Exibe uma notificação rica usando Notifee.
 * Esta função é usada tanto para foreground quanto para background.
 */
export async function displayNotification(payload: NotificationPayload) {
  const { title, body, imageUrl, url, messageId } = payload;

  // Garante que o canal existe antes de exibir a notificação
  const channelId = await createNotificationChannel();

  await notifee.displayNotification({
    title,
    body,
    data: {
      url,
      messageId,
    },
    android: {
      channelId,
      importance: AndroidImportance.HIGH,
      style: imageUrl ? { type: AndroidStyle.BIGPICTURE, picture: imageUrl } : undefined,
      pressAction: {
        id: 'default',
      },
    },
    ios: {
      // Para iOS, a imagem é adicionada como um anexo
      attachments: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  });
}