import { AuthContextData, SignInProps, UserProps } from '@/types/app-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import serviceapp, { setSessionExpiredCallback } from '../services/serviceapp';

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [user, setUser] = useState<any>(null);
    const [deviceId, setDeviceId] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [positionGlobal, setPositionGlobal] = useState<any>([0, 0]);
    const storageUserKey = 'solar_user';
    const storageKeepLoggedInKey = 'solar_keepLoggedIn';
    const [storeList, setStoreList] = useState<any>([]);
    const [currentCity, setCurrentCity] = useState<any>(null);

    useEffect(() => {
        async function initializeApp() {
            setLoading(true);
            try {
                // 1. Get Device ID
                let deviceIdValue = await AsyncStorage.getItem('deviceid');
                if (deviceIdValue === null) {
                    const uniqueId = await DeviceInfo.getUniqueId();
                    if (uniqueId) {
                        await AsyncStorage.setItem('deviceid', uniqueId);
                        deviceIdValue = uniqueId;
                    }
                }
                setDeviceId(deviceIdValue);

                // 2. Check for "keepLoggedIn"
                const keepLoggedIn = await SecureStore.getItemAsync(
                    storageKeepLoggedInKey,
                );
                if (keepLoggedIn === 'true') {
                    const storedUser =
                        await SecureStore.getItemAsync(storageUserKey);
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                        router.replace('/');
                        setLoading(false);
                        return;
                    }
                }

                // 3. Get location if not logged in
                try {
                    const {status} =
                        await Location.requestForegroundPermissionsAsync();
                    if (status !== 'granted') {
                        Alert.alert(
                            'Permissão de Localização',
                            'A permissão de localização é necessária para encontrar lojas próximas. Por favor, habilite nas configurações do seu dispositivo.',
                        );
                        return;
                    }

                    const isLocationEnabled =
                        await Location.hasServicesEnabledAsync();
                    if (!isLocationEnabled) {
                        Alert.alert(
                            'Serviço de Localização',
                            'O serviço de localização está desativado. Por favor, ative-o para continuar.',
                        );
                        return;
                    }

                    const location = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.High,
                    });
                    const {latitude, longitude} = location.coords;
                    setPositionGlobal([latitude, longitude]);
                    const resp = await Location.reverseGeocodeAsync({latitude, longitude});
                    if (resp.length > 0) {
                        setCurrentCity(resp[0].subregion);
                    }
                } catch (locationError) {
                    if (__DEV__) console.error('Erro ao obter localização:', locationError);
                    Alert.alert(
                        'Erro de Localização',
                        'Não foi possível obter sua localização. Verifique suas configurações de GPS e conexão com a internet.',
                    );
                }
            } catch (error) {
                if (__DEV__) console.error('Falha na inicialização do app', error);
            } finally {
                setLoading(false);
            }
        }

        initializeApp();
    }, []);

    const signIn = async (cpfcnpj: SignInProps) => {
        setLoading(true);
        try {
            const response = await serviceapp.get(
                `(WS_LOGIN_APP)?cpfcnpj=${cpfcnpj}`,
            );
            if (response.status !== 200) {
                setLoading(false);
                return 'Erro ao conectar ao servidor. O serviço da aplicação parece estar parado.';
            }
            const {data} = response.data.resposta;
            if (data.cadastroCliente && data.cadastroSenha) {
                setLoading(false);
                router.replace({
                    pathname: '/check-password',
                    params: {
                        cpfcnpj: cpfcnpj as any,
                        nomeCliente: data.nomeCliente,
                        codigoCliente: data.codigoCliente,
                    },
                });
            }
            if (!data.cadastroCliente && !data.cadastroSenha) {
                setLoading(false);
                router.replace({
                    // pathname: '/register-customer',
                    pathname: '/not-registered',
                    params: {
                        cpfcnpj: cpfcnpj as any,
                    },
                });
            }
            if (data.cadastroCliente && !data.cadastroSenha) {
                setLoading(false);
                router.replace({
                    pathname: '/register-password',
                    params: {
                        cpfcnpj: cpfcnpj as any,
                        nomeCliente: data.nomeCliente,
                    },
                });
            }
        } catch (error) {
            if (__DEV__) console.log('Erro ao conectar ao servidor (signIn):', error);
            return 'Erro ao conectar ao servidor. O serviço da aplicação parece estar parado.';
        } finally {
            setLoading(false);
        }
    };

    const checkPassword = async (datacheck: UserProps) => {
        
        setLoading(true);
        try {
            const response = await serviceapp.get(
                `(WS_VERIFICAR_SENHA_APP)?cpfcnpj=${datacheck?.cpfcnpj}&senha=${datacheck?.senha}&deviceId=${deviceId}`,
            );
            if (response.status !== 200) {
                setLoading(false);
                return 'Erro ao conectar ao servidor. O serviço da aplicação parece estar parado.';
            }
            const {success, message, data} = response.data.resposta;

            if (!success) {
                return `${message}`;
            }

            let userData = {
                cpfcnpj: datacheck?.cpfcnpj,
                codigoCliente: datacheck.codigoCliente,
                nomeCliente: datacheck.nomeCliente,
                token: data.token,
            };

            if (datacheck.continuarLogado) {
                await SecureStore.setItemAsync(storageKeepLoggedInKey, 'true');
            } else {
                await SecureStore.deleteItemAsync(storageKeepLoggedInKey);
            }

            await SecureStore.setItemAsync(
                storageUserKey,
                JSON.stringify(userData),
            );
            setUser(userData);
            router.replace('/');
        } catch (error) {
            if (__DEV__) console.log(`Ocorreu um erro: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await SecureStore.deleteItemAsync(storageUserKey);
            await SecureStore.deleteItemAsync(storageKeepLoggedInKey);
            setUser(null);
            router.replace('/');
        } catch (error) {
            if (__DEV__) console.log(`Ocorreu um erro: ${error}`);
        }
    };

    const disconnect = useCallback(async () => {
        try {
            await SecureStore.deleteItemAsync(storageUserKey);
            await SecureStore.deleteItemAsync(storageKeepLoggedInKey);
            await AsyncStorage.removeItem('deviceid');
            setUser(null);
            router.replace('/');
        } catch (e) {
            if (__DEV__) console.log('Error removing keys from AsyncStorage:', e);
        }
    }, []);

    useEffect(() => {
        setSessionExpiredCallback(disconnect);
    }, [disconnect]);

    return (
        <AuthContext.Provider
            value={{
                signedIn: !!user,
                user,
                signIn, // Cast to any to satisfy the type for now
                checkPassword,
                setUser,
                loading,
                setLoading,
                storeList,
                setStoreList,
                deviceId,
                signOut,
                disconnect,
                positionGlobal,
                currentCity,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
