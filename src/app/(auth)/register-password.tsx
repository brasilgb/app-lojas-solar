import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import MessageAlert from '@/components/MessageAlert';
import ScreenHeader from '@/components/ScreenHeader';
import { useAuthContext } from '@/contexts/AppContext';
import { maskPhone } from '@/lib/mask';
import { RegisterPasswordFormType, RegisterPasswordSchema } from '@/schema/app';
import serviceapp from '@/services/serviceapp';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { EyeClosedIcon, EyeIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const RegisterPassword = () => {
    const params = useLocalSearchParams<any>();
    const { bottom } = useSafeAreaInsets();
    const [loading, setLoading] = useState<boolean>(false);
    const { user, setUser, disconnect } = useAuthContext();
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [modalTitle, setModalTitle] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<RegisterPasswordFormType>({
        defaultValues: {},
        resolver: zodResolver(RegisterPasswordSchema),
    });

    const onSubmit: SubmitHandler<RegisterPasswordFormType> = async (
        data: RegisterPasswordFormType,
    ) => {
        Keyboard.dismiss();
        setLoading(true);
        await serviceapp
            .get(
                `(WS_ALTERAR_SENHA_APP)?cpfcnpj=${params.cpfcnpj}&senha=${data.senha}&emailCliente=${data.email}&celularCliente=${data.celular}`,
            )
            .then(response => {
                const { message, success } = response?.data?.resposta;

                if (!success) {
                    setModalVisible(true);
                    setModalMessage(message);
                    setModalTitle('Erro!');
                    return;
                }

                reset();
                setModalVisible(true);
                setModalMessage(message);
                setModalTitle('Cadastrar Senha');
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
                router.replace({
                    pathname: '/password-changed',
                    params: {
                        cpfcnpj: params.cpfcnpj,
                    },
                } as any);
            });
    };

    return (
        <View className="bg-white flex-1">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
                className="bg-solar-blue-primary"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ paddingBottom: bottom }}
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
                                        field: { onChange, onBlur, value },
                                    }) => (
                                        <View>
                                            <Input
                                                label="E-mail"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                inputClasses={`${errors.email ? '!border-solar-red-primary' : ''}`}
                                            />
                                        </View>
                                    )}
                                    name="email"
                                />
                                {errors.email && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.email?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    render={({
                                        field: { onChange, onBlur, value },
                                    }) => (
                                        <View>
                                            <Input
                                                label="Celular"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={maskPhone(value)}
                                                inputClasses={`${errors.celular ? '!border-solar-red-primary' : ''}`}
                                            />
                                        </View>
                                    )}
                                    name="celular"
                                />
                                {errors.celular && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.celular?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    render={({
                                        field: { onChange, onBlur, value },
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
                                        field: { onChange, onBlur, value },
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

export default RegisterPassword;
