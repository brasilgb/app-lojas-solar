import {Button} from '@/components/Button';
import {Input} from '@/components/Input';
import MessageAlert from '@/components/MessageAlert';
import ScreenHeader from '@/components/ScreenHeader';
import {useAuthContext} from '@/contexts/AppContext';
import {AlterPasswordFormType, AlterPasswordSchema} from '@/schema/app';
import serviceapp from '@/services/serviceapp';
import {zodResolver} from '@hookform/resolvers/zod';
import {EyeClosedIcon, EyeIcon} from 'lucide-react-native';
import React, {useEffect, useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MyAccount = () => {
    const {bottom} = useSafeAreaInsets();
    const [loading, setLoading] = useState<boolean>(false);
    const {user, setUser, disconnect} = useAuthContext();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [modalTitle, setModalTitle] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    useEffect(() => {
        const getCustomers = async () => {
            // setLoading(true)
        };
        getCustomers();
    }, []);

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<AlterPasswordFormType>({
        defaultValues: {},
        resolver: zodResolver(AlterPasswordSchema),
    });

    const onSubmit: SubmitHandler<AlterPasswordFormType> = async (
        data: AlterPasswordFormType,
    ) => {
        Keyboard.dismiss();
        setLoading(true);
        await serviceapp
            .get(
                `(WS_ALTERAR_SENHA_APP)?cpfcnpj=${user.cpfcnpj}&senha=${data.senha}&token=${user?.token}&senhaAnterior=${data.senhaAnterior}`,
            )
            .then(response => {
                const {data, message, success} = response?.data?.resposta;

                if (!success) {
                    setModalVisible(true);
                    setModalMessage(message);
                    setModalTitle('Erro!');
                    return;
                }

                let userData = {
                    connected: user.connected,
                    cpfcnpj: user.cpfcnpj,
                    nomeCliente: user.nomeCliente,
                    token: data.token,
                } as any;

                reset();
                setUser(userData);
                setModalVisible(true);
                setModalMessage(message);
                setModalTitle('Alterar Senha');
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <View className="bg-white flex-1">
            <MessageAlert
                visible={modalVisible}
                onClose={setModalVisible}
                title={modalTitle}
                message={modalMessage}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
                className="bg-solar-blue-primary"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{paddingBottom: bottom}}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1">
                        <ScreenHeader
                            title="Minha Conta"
                            subtitle="Alterar minha senha"
                            classTitle="text-white text-2xl"
                            classSubtitle="text-white text-base text-center"
                        />
                        <View className="p-4 bg-white rounded-t-3xl h-full">
                            <View className="flex-col gap-4 my-4">
                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View className="relative">
                                            <Input
                                                label="Senha Anterior"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                inputClasses={`${errors.senhaAnterior ? '!border-solar-red-primary' : ''} text-gray-800`}
                                                secureTextEntry={!showPassword}
                                            />
                                            <View className="absolute right-4 top-9 ">
                                                {showPassword ? (
                                                    <EyeClosedIcon
                                                        size={30}
                                                        color={'#777777'}
                                                        onPress={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <EyeIcon
                                                        size={30}
                                                        color={'#777777'}
                                                        onPress={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </View>
                                        </View>
                                    )}
                                    name="senhaAnterior"
                                />
                                {errors.senhaAnterior && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.senhaAnterior?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View className="relative">
                                            <Input
                                                label="Nova senha"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                inputClasses={`${errors.senha ? '!border-solar-red-primary' : ''} text-gray-800`}
                                                secureTextEntry={!showPassword}
                                            />
                                            <View className="absolute right-4 top-9 ">
                                                {showPassword ? (
                                                    <EyeClosedIcon
                                                        size={30}
                                                        color={'#777777'}
                                                        onPress={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <EyeIcon
                                                        size={30}
                                                        color={'#777777'}
                                                        onPress={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </View>
                                        </View>
                                    )}
                                    name="senha"
                                />
                                {errors.senha && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.senha?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View className="relative">
                                            <Input
                                                label="Repita a nova senha"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                inputClasses={`${errors.repitaSenha ? '!border-solar-red-primary' : ''} text-gray-800`}
                                                secureTextEntry={!showPassword}
                                            />
                                            <View className="absolute right-4 top-9 ">
                                                {showPassword ? (
                                                    <EyeClosedIcon
                                                        size={30}
                                                        color={'#777777'}
                                                        onPress={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                    />
                                                ) : (
                                                    <EyeIcon
                                                        size={30}
                                                        color={'#777777'}
                                                        onPress={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </View>
                                        </View>
                                    )}
                                    name="repitaSenha"
                                />
                                {errors.repitaSenha && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.repitaSenha?.message}
                                    </Text>
                                )}
                            </View>

                            <Button
                                label={
                                    loading ? (
                                        <ActivityIndicator
                                            size="small"
                                            color="#bccf00"
                                        />
                                    ) : (
                                        'Alterar'
                                    )
                                }
                                variant={'secondary'}
                                size={'lg'}
                                onPress={handleSubmit(onSubmit)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default MyAccount;
