// src/utils/deviceStorage.ts
import * as Keychain from 'react-native-keychain';
import { v4 as uuidv4 } from 'uuid';

/**
 * Nome da chave que será usada para armazenar o ID no Keychain/Keystore.
 * É o 'username' da função setGenericPassword.
 */
const UNIQUE_ID_SERVICE_KEY = 'uniqueDeviceId';

/**
 * Obtém ou gera um ID Único persistente no dispositivo, utilizando o Keychain no iOS
 * para garantir que o ID sobreviva à desinstalação/reinstalação do app.
 *
 * @returns {Promise<string>} O ID Único do dispositivo.
 */
export async function getPersistentUniqueId(): Promise<string> {
    try {
        // 1. Tenta recuperar o ID existente
        const credentials = await Keychain.getGenericPassword({ service: UNIQUE_ID_SERVICE_KEY });

        if (credentials && credentials.password) {
            // ID encontrado, retorna o valor existente.
            return credentials.password;
        } else {
            // 2. ID não encontrado (primeira execução ou após desinstalação completa no iOS):
            // Gera um novo UUID.
            const newUniqueId = uuidv4();

            // 3. Armazena o novo UUID no Keychain/Keystore.
            // O 'username' deve ser a UNIQUE_ID_SERVICE_KEY, e a 'password' é o nosso UUID.
            await Keychain.setGenericPassword(UNIQUE_ID_SERVICE_KEY, newUniqueId, {
                service: UNIQUE_ID_SERVICE_KEY,
            });

            console.log('Device ID: Novo UUID gerado e armazenado:', newUniqueId);
            return newUniqueId;
        }
    } catch (error) {
        console.error("Erro ao gerenciar o ID Único Persistente (Keychain):", error);
        // Fallback: Em caso de erro grave no Keychain, retorna o ID do DeviceInfo
        // (Isso é apenas um último recurso, pois não garante a persistência).
        return "ERROR_FALLBACK_ID"; 
    }
}