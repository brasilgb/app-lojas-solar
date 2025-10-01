

import { AuthContextData, SignInProps, UserProps } from "@/types/app-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
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
    const storageUserKey = '@solar:user';
    const [storeList, setStoreList] =useState<any>([]);
    const [currentCity, setCurrentCity] = useState<any>(null);

    useEffect(() => {
        async function loadPosition() {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
            }
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            setPositionGlobal([latitude, longitude]);
            
            let resp: any = await Location.reverseGeocodeAsync({           
                latitude,
                longitude
            });
            setCurrentCity(resp[0]?.subregion);

        }
        loadPosition();
    }, []);

    useEffect(() => {
        const loadStorageData = async () => {
            setLoading(true);
            try {
                const storedUser = await AsyncStorage.getItem(storageUserKey);
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Falha ao carregar dados do storage", error);
            } finally {
                setLoading(false);
            };
        };
        loadStorageData();
    }, []);

    useEffect(() => {
        const getValueDevice = async () => {
            try {
                const value = await AsyncStorage.getItem("deviceid");
                if (value !== null) {
                    setDeviceId(value);
                } else {
                    const uniqueId = await DeviceInfo.getUniqueId();
                    if (uniqueId) {
                        await AsyncStorage.setItem("deviceid", uniqueId);
                        setDeviceId(uniqueId);
                    }
                }
            } catch (error) {
                console.error('AsyncStorage Error: ', error);
            }
        }
        getValueDevice();
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

            await AsyncStorage.setItem(storageUserKey, JSON.stringify(userData));
            setUser(userData);
            router.replace('/(drawer)');
        } catch (error) {
            console.log(`Ocorreu um erro: ${error}`);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await AsyncStorage.removeItem(storageUserKey);
            setUser(null);
            router.replace('/(drawer)');
        } catch (error) {
            console.log(`Ocorreu um erro: ${error}`);
        }
    };

    async function disconnect() {
        const keys = ['Auth_user', 'deviceid']
        try {
            await AsyncStorage.multiRemove(keys)
            setUser(null);
            router.replace('/(drawer)');
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