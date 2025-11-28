import {Button} from '@/components/Button';
import {Checkbox} from '@/components/Checkbox';
import {Input} from '@/components/Input';
import MessageAlert from '@/components/MessageAlert';
import ScreenHeader from '@/components/ScreenHeader';
import AuthLayout from '@/components/auth-layout';
import {useAuthContext} from '@/contexts/AppContext';
import {CheckPasswordFormType, CheckPasswordSchema} from '@/schema/app';
import {UserProps} from '@/types/app-types';
import {zodResolver} from '@hookform/resolvers/zod';
import {useLocalSearchParams} from 'expo-router';
import {ArrowRight, Check, EyeClosedIcon, EyeIcon} from 'lucide-react-native';
import React, {useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {ActivityIndicator, Alert, Keyboard, Text, View} from 'react-native';

const CheckPassword = () => {
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [passwordActions, setPasswordActions] = useState<string>('');
    const {checkPassword} = useAuthContext();

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<CheckPasswordFormType>({
        defaultValues: {
            senha: '',
            continuarLogado: false,
        },
        resolver: zodResolver(CheckPasswordSchema),
    });

    const onSubmit: SubmitHandler<CheckPasswordFormType> = async (
        data: CheckPasswordFormType,
    ) => {
        setLoading(true);
        try {
            let {senha, continuarLogado} = data;
            let cpfcnpj = params?.cpfcnpj;
            let datacheck = {
                cpfcnpj: cpfcnpj,
                senha: senha,
                nomeCliente: params?.nomeCliente,
                codigoCliente: params?.codigoCliente,
                continuarLogado: continuarLogado,
            } as unknown as UserProps;
            Keyboard.dismiss();
            const checked: any = await checkPassword(datacheck);
            if(checked) {
                setPasswordActions(checked)
            }
            if (checked) {
                reset();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <ScreenHeader
                title={params?.nomeCliente as string}
                subtitle="Falta pouco, agora digite sua senha."
                classTitle={'text-base text-gray-600'}
                classSubtitle="text-lg text-gray-500"
            />
            <View className="px-4 rounded-t-3xl">
                <View className="flex-col relative">
                    <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                            <View className="relative">
                                <Input
                                    label=""
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    inputClasses={`${errors.senha ? '!border-solar-red-primary' : ''} !pl-12 text-gray-800`}
                                    secureTextEntry={!showPassword}
                                />
                                <View className="absolute left-1 top-1 ">
                                    {showPassword ? (
                                        <EyeClosedIcon
                                            size={30}
                                            color={'#777777'}
                                            onPress={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        />
                                    ) : (
                                        <EyeIcon
                                            size={30}
                                            color={'#777777'}
                                            onPress={() =>
                                                setShowPassword(!showPassword)
                                            }
                                        />
                                    )}
                                </View>
                            </View>
                        )}
                        name="senha"
                    />
                    {passwordActions && (
                        <Text className="text-solar-red-primary">
                            {passwordActions}
                        </Text>
                    )}
                    <Button
                        label={
                            loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#bccf00"
                                />
                            ) : (
                                <ArrowRight />
                            )
                        }
                        variant={'link'}
                        size={'icon'}
                        onPress={handleSubmit(onSubmit)}
                        className={`absolute right-1 top-1 border border-gray-400 rounded-full ${loading ? 'pt-3' : 'pt-2'} items-center justify-center`}
                    />
                </View>
                <View className="mt-2 flex-row justify-between items-center">
                    <Controller
                        control={control}
                        name="continuarLogado"
                        render={({field: {onChange, value}}) => (
                            <Checkbox
                                label="Continuar logado"
                                checkboxClasses="w-6 h-6"
                                isSelected={value}
                                onValueChange={onChange}
                            />
                        )}
                    />
                    <Button
                        variant={'link'}
                        label={'Esqueci a senha'}
                        labelClasses="text-base text-gray-500"
                    />
                </View>
            </View>
        </AuthLayout>
    );
};

export default CheckPassword;
