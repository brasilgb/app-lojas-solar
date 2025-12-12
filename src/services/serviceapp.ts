import axios from 'axios';
import { Alert } from 'react-native';

// Não é mais necessário ser global, será obtido de _error.config no interceptor
// let requestCustom: any; 
// let data: any;

let BASE_URL = '';

// 1. Variável para guardar a função de callback
let onSessionExpired: (() => void) | null = null;

// 2. Função para registrar o callback
export const setSessionExpiredCallback = (callback: () => void) => {
    onSessionExpired = callback;
};

const serviceapp = axios.create({
    withCredentials: true,
    // Definindo um timeout de conexão um pouco mais longo, se necessário.
    // timeout: 10000, 
});

// --- INTERCEPTOR DE REQUISIÇÃO (REQUEST) ---
serviceapp.interceptors.request.use(async request => {
    // Define a URL base
    request.baseURL = process.env.EXPO_PUBLIC_API_URL;
    BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}`;

    // As linhas abaixo foram removidas/comentadas,
    // pois usar as variáveis de ambiente é a melhor prática.
    // request.baseURL = "http://172.16.1.67:9090/servicecomercial/servlet/isCobol/";
    // BASE_URL = "http://172.16.1.67:9090/servicecomercial/servlet/isCobol/";

    // NÃO precisamos mais salvar em globais
    // requestCustom = request; 
    // data = request.data; 

    return request;
});

// --- INTERCEPTOR DE RESPOSTA (RESPONSE) ---
serviceapp.interceptors.response.use(
    response => {
        // Tratamento de expiração de sessão pela resposta JSON (se houver 'token === false')
        if (response.data && response.data.resposta) {
            const { message, token } = response.data.resposta;

            if (token === false) {
                const msg = message || 'Sessão inválida.';
                if (onSessionExpired) {
                    Alert.alert('Atenção', msg, [
                        {
                            text: 'Ok',
                            onPress: onSessionExpired,
                        },
                    ]);
                }
                // Rejeita para não continuar a cadeia de promessas
                return Promise.reject(new Error(msg));
            }
        }
        return response;
    },
    // --- TRATAMENTO DE ERROS (INCLUINDO RENOVAÇÃO DE SESSÃO) ---
    async _error => {
        const originalRequest = _error.config;

        // 1. TRATAMENTO DE EXPIRAÇÃO DE SESSÃO (401)
        if (_error.response && _error.response.status === 401) {
            const message =
                _error.response.data?.resposta?.message ||
                'Sessão expirada. Faça o login novamente.';

            if (onSessionExpired) {
                Alert.alert('Atenção', message, [
                    {
                        text: 'Ok',
                        onPress: onSessionExpired,
                    },
                ]);
            }
            // Rejeita o pedido original
            return Promise.reject(new Error(message));
        }

        // 2. TENTATIVA DE RENOVAÇÃO DE SESSÃO E RETRY (Para outros erros, como falha de conexão)
        console.log('Erro de conexão ou outro erro. Tentando reconectar a sessão...');

        try {
            // 2.1. TENTA REABRIR A SESSÃO
            // Usamos o mesmo serviço para garantir que os cookies/credenciais sejam mantidos.
            const sessionResponse = await serviceapp.get('(serviceapp)');

            if (sessionResponse.status !== 200) {
                console.log('Falha na tentativa de reabrir a sessão.');
                // Se a reabertura falhar, rejeita o erro original
                return Promise.reject(_error);
            }

            // 2.2. REFAZ A CHAMADA ORIGINAL
            console.log('Sessão reaberta com sucesso. Refazendo a chamada original...');

            // Usa serviceapp.request(originalRequest) para refazer QUALQUER tipo de pedido (GET, POST, etc.)
            // com a mesma configuração.
            return serviceapp.request(originalRequest);
        } catch (retryError) {
            // Se a tentativa de retry falhar (por exemplo, falha de conexão persistente)
            console.log('Falha ao refazer a chamada original ou ao reabrir a sessão.', retryError);
            // Rejeita o erro original para ser tratado pelo código que fez a chamada
            return Promise.reject(_error);
        }
    },
);

export default serviceapp;