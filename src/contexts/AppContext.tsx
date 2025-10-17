

import { AuthContextData, SignInProps, UserProps } from "@/types/app-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import * as SecureStore from 'expo-secure-store';
import { router } from "expo-router";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import DeviceInfo from 'react-native-device-info';
import serviceapp from "../services/serviceapp";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
                let deviceIdValue = await AsyncStorage.getItem("deviceid");
                if (deviceIdValue === null) {
                    const uniqueId = await DeviceInfo.getUniqueId();
                    if (uniqueId) {
                        await AsyncStorage.setItem("deviceid", uniqueId);
                        deviceIdValue = uniqueId;
                    }
                }
                setDeviceId(deviceIdValue);

                // 2. Check for "keepLoggedIn"
                const keepLoggedIn = await SecureStore.getItemAsync(storageKeepLoggedInKey);
                if (keepLoggedIn === 'true') {
                    const storedUser = await SecureStore.getItemAsync(storageUserKey);
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                        router.replace('/');
                        setLoading(false);
                        return;
                    }
                }

                // 3. Get location if not logged in
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.log('Permission to access location was denied');
                } else {
                    const location = await Location.getCurrentPositionAsync({});
                    const { latitude, longitude } = location.coords;
                    setPositionGlobal([latitude, longitude]);
                    let resp: any = await Location.reverseGeocodeAsync({
                        latitude,
                        longitude
                    });
                    setCurrentCity(resp[0]?.subregion);
                }
            } catch (error) {
                console.error("Falha na inicialização do app", error);
            } finally {
                setLoading(false);
            }
        }

        initializeApp();
    }, []);

    const signIn = async (cpfcnpj: SignInProps) => {
        setLoading(true);
        try {
            const response = await serviceapp.get(`(WS_LOGIN_APP)?cpfcnpj=${cpfcnpj}`);
            if (response.status !== 200) {
                setLoading(false);
                return 'Erro ao conectar ao servidor. O serviço da aplicação parece estar parado.';
            }
            const { data } = response.data.resposta;
            console.log(data);

            if (data.cadastroCliente && data.cadastroSenha) {
                setLoading(false);
                router.replace({
                    pathname: '/check-password',
                    params: {
                        cpfcnpj: cpfcnpj as any,
                        nomeCliente: data.nomeCliente,
                        codigoCliente: data.codigoCliente,
                    }
                })
            }
            if (!data.cadastroCliente && !data.cadastroSenha) {
                setLoading(false);
                router.replace({
                    // pathname: '/register-customer',
                    pathname: '/not-registered',
                    params: {
                        cpfcnpj: cpfcnpj as any
                    }
                })
            }
            if (data.cadastroCliente && !data.cadastroSenha) {
                setLoading(false);
                router.replace({
                    pathname: '/register-password',
                    params: {
                        cpfcnpj: cpfcnpj as any,
                        nomeCliente: data.nomeCliente
                    }
                })
            }
        } catch (error) {
            return 'Erro ao conectar ao servidor. O serviço da aplicação parece estar parado.';
        } finally {
            setLoading(false);
        }
    };

    const checkPassword = async (datacheck: UserProps) => {
        setLoading(true);
        try {
            const response = await serviceapp.get(`(WS_VERIFICAR_SENHA_APP)?cpfcnpj=${datacheck?.cpfcnpj}&senha=${datacheck?.senha}&deviceId=${deviceId}`);
            if (response.status !== 200) {
                setLoading(false);
                return 'Erro ao conectar ao servidor. O serviço da aplicação parece estar parado.';
            }
            const { success, message, data } = response.data.resposta;

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

            await SecureStore.setItemAsync(storageUserKey, JSON.stringify(userData));
            setUser(userData);
            router.replace('/');
        } catch (error) {
            console.log(`Ocorreu um erro: ${error}`);
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
            console.log(`Ocorreu um erro: ${error}`);
        }
    };

    async function disconnect() {
        try {
            await SecureStore.deleteItemAsync(storageUserKey);
            await SecureStore.deleteItemAsync(storageKeepLoggedInKey);
            await AsyncStorage.removeItem('deviceid');
            setUser(null);
            router.replace('/');
        } catch (e) {
            console.log('Error removing keys from AsyncStorage:', e);
        }
    }

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
                currentCity
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);