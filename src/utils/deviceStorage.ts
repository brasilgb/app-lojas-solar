// src/utils/deviceStorage.ts

import * as Keychain from 'react-native-keychain';
import { v4 as uuidv4 } from 'uuid';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info'; // RE-INSTALAR SE FOI REMOVIDO!
import 'react-native-get-random-values'; // Necessário para uuid no iOS/RN

/**
 * Nome da chave que será usada para armazenar o ID no Keychain (apenas iOS).
 */
const UNIQUE_ID_SERVICE_KEY = 'uniqueDeviceId';

/**
 * Obtém o ID Único do dispositivo com lógica específica por plataforma:
 * - iOS: Usa Keychain para persistência após desinstalação.
 * - Android: Usa o Device ID nativo (Android ID), pois é mais estável
 * do que o Keystore após uma desinstalação completa.
 *
 * @returns {Promise<string>} O ID Único do dispositivo.
 */
export async function getPersistentUniqueId(): Promise<string> {
    
    // ----------------------------------------------------------------
    // 🤖 LÓGICA ANDROID: Usar o ID Nativo (Android ID)
    // ----------------------------------------------------------------
    if (Platform.OS === 'android') {
        // No Android, o getUniqueId() é o identificador mais confiável para sobrevivência.
        try {
            const deviceId = await DeviceInfo.getUniqueId();
            console.log('Device ID (Android Nativo):', deviceId);
            return deviceId;
        } catch (error) {
            console.error("Erro ao obter Device ID no Android:", error);
            // Fallback em caso de erro grave (embora seja raro com DeviceInfo)
            return 'ANDROID_ID_FALLBACK';
        }
    }

    // ----------------------------------------------------------------
    // 🍏 LÓGICA iOS: Usar o Keychain para persistência
    // ----------------------------------------------------------------
    if (Platform.OS === 'ios') {
        try {
            // 1. Tenta recuperar o ID existente
            const credentials = await Keychain.getGenericPassword({ service: UNIQUE_ID_SERVICE_KEY });

            if (credentials && credentials.password) {
                // ID encontrado, retorna o valor existente.
                console.log('Device ID (iOS Keychain): Recuperado.');
                return credentials.password;
            } else {
                // 2. ID não encontrado: Gera um novo UUID.
                const newUniqueId = uuidv4();

                // 3. Armazena o novo UUID no Keychain (requer Keychain Sharing ativado no Xcode)
                await Keychain.setGenericPassword(UNIQUE_ID_SERVICE_KEY, newUniqueId, {
                    service: UNIQUE_ID_SERVICE_KEY,
                });

                console.log('Device ID (iOS Keychain): Novo UUID gerado e armazenado.');
                return newUniqueId;
            }
        } catch (error) {
            console.error("Erro ao gerenciar o ID Único Persistente (iOS Keychain):", error);
            // Fallback (Pode ser erro de permissão do Keychain Sharing)
            return 'IOS_KEYCHAIN_FALLBACK';
        }
    }

    // Fallback para outras plataformas (web, etc.)
    return 'UNKNOWN_PLATFORM_ID';
}