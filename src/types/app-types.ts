interface SignInProps {
    cpfcnpj: string;
}

interface CheckPasswordProps {
    cpfcnpj: string;
    senha: string;
    deviceId: string;
}

interface UserProps {
    cpfcnpj: string;
    senha: string;
    nomeCliente: string;
    codigoCliente: string;
    token: string;
    connected: boolean;
    continuarLogado: boolean;
}

interface AuthContextData {
    setUser: React.Dispatch<React.SetStateAction<UserProps | null>>;
    user: UserProps;
    signIn: any;
    checkPassword: any;
    signOut: () => void;
    deviceId: string;
    signedIn: boolean;
    disconnect: () => void;
    positionGlobal: any;
    storeList: any;
    setStoreList: any;
    loading: any;
    setLoading: any;
}

export {AuthContextData, CheckPasswordProps, SignInProps, UserProps};
