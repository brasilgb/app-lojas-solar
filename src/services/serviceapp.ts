import axios from 'axios';
import {Alert} from 'react-native';

let BASE_URL = '';

let requestCustom: any;
let data: any;

// 1. Variável para guardar a função de callback
let onSessionExpired: (() => void) | null = null;

// 2. Função para registrar o callback
export const setSessionExpiredCallback = (callback: () => void) => {
    onSessionExpired = callback;
};

const serviceapp = axios.create({
    withCredentials: true,
});

serviceapp.interceptors.request.use(async request => {
    request.baseURL = process.env.EXPO_PUBLIC_API_URL;
    BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}`;

    // request.baseURL = "http://172.16.1.215:9090/servicecomercial/servlet/isCobol/";
    // BASE_URL = "http://172.16.1.215:9090/servicecomercial/servlet/isCobol/";

    // request.baseURL = "http://172.16.1.67:9090/servicecomercial/servlet/isCobol/";
    // BASE_URL = "http://172.16.1.67:9090/servicecomercial/servlet/isCobol/";

    requestCustom = request;
    data = request.data;
    return request;
});

serviceapp.interceptors.response.use(
    response => {
        if (response.data && response.data.resposta) {
            const {message, token} = response.data.resposta;
            // A verificação é `token === false` para evitar casos onde o token não está presente na resposta
            if (token === false) {
                if (onSessionExpired) {
                    Alert.alert('Atenção', message, [
                        {
                            text: 'Ok',
                            onPress: () => {
                                if (onSessionExpired) {
                                    onSessionExpired();
                                }
                            },
                        },
                    ]);
                }
                // Rejeita a promessa para que a chamada original não continue
                return Promise.reject(new Error(message || 'Sessão inválida.'));
            }
        }
        return response;
    },
    async _error => {
        if (_error.response && _error.response.status === 401) {
            const message =
                _error.response.data.resposta.message ||
                'Sessão expirada. Faça o login novamente.';
            if (onSessionExpired) {
                Alert.alert('Atenção', message, [
                    {
                        text: 'Ok',
                        onPress: () => {
                            if (onSessionExpired) {
                                onSessionExpired();
                            }
                        },
                    },
                ]);
            }
            return Promise.reject(new Error(message));
        }

        console.log('Abrindo sessão com o servidor novamente');

        const axiosNew = axios.create({
            baseURL: BASE_URL,
            withCredentials: true,
        });

        let session = await axiosNew
            .get('(serviceapp)')
            .then(resp => resp)
            .catch(_err => {
                return {
                    status: 404,
                    success: false,
                    message: 'Não foi possível conectar ao servidor 1',
                };
            });

        if (session.status !== 200) {
            session = {
                status: 404,
                success: false,
                message: 'Não foi possível conectar ao servidor 2',
            };

            return session;
        }

        console.log('Refazendo a chamada original...');
        let originalResponse;
        if (
            requestCustom.method === 'POST' ||
            requestCustom.method === 'post'
        ) {
            originalResponse = await serviceapp.post(
                `${requestCustom.url}`,
                data,
            );
        } else {
            originalResponse = await serviceapp.get(`${requestCustom.url}`);
        }
        if (originalResponse.status !== 200) {
            session = {
                status: 404,
                success: false,
                message: 'Não foi possível conectar ao servidor 3',
            };
            return session;
        }
        return originalResponse;
    },
);

export default serviceapp;
