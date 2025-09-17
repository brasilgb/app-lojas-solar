interface SignInProps {
    cpfcnpj: string;
}

interface CheckPasswordProps {
    cpfcnpj: string;
    senha: string;
    deviceId: string;
}

interface UserProps {
    cpfCnpj: string
    senha: string
    nomeCliente: string
    codigoCliente: string
    token: string
    connected: boolean
}

interface AuthContextData {
    setUser: React.Dispatch<React.SetStateAction<UserProps | null>>
    user: UserProps
    signIn: (data: SignInProps) => Promise<void>
    checkPassword: (data: UserProps) => Promise<void>
    signOut: () => void
    deviceId: string
    signedIn: boolean
    disconnect: () => void
}

export {
    SignInProps,
    CheckPasswordProps,
    UserProps,
    AuthContextData
}