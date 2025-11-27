import AppLoading from '@/components/app-loading';
import {Button} from '@/components/Button';
import {Input} from '@/components/Input';
import MessageAlert from '@/components/MessageAlert';
import ScreenHeader from '@/components/ScreenHeader';
import {useAuthContext} from '@/contexts/AppContext';
import {maskCep, maskCpfCnpj, maskDate, maskPhone, unMask} from '@/lib/mask';
import {CustomerFormType, customerSchema} from '@/schema/app';
import serviceapp from '@/services/serviceapp';
import {zodResolver} from '@hookform/resolvers/zod';
import {useIsFocused} from '@react-navigation/native';
import {router} from 'expo-router';
import {UserMinus2Icon} from 'lucide-react-native';
import React, {useEffect, useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MyAccount = () => {
    const {bottom} = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState<boolean>(false);
    const {user, disconnect} = useAuthContext();
    const [customers, setCustomers] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [modalTitle, setModalTitle] = useState<string>('');

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors},
    } = useForm<CustomerFormType>({
        defaultValues: {
            cpfcnpj: user?.cpfcnpj,
            nomeCliente: customers?.nomeCliente,
            enderecoCliente: customers?.enderecoCliente,
            cepCliente: customers?.cepCliente,
            ufCliente: customers?.ufCliente,
            cidadeCliente: customers?.cidadeCliente,
            celularCliente: customers?.celularCliente,
            emailCliente: customers?.emailCliente,
            nascimentoCliente: customers?.nascimentoCliente,
        },
        resolver: zodResolver(customerSchema),
    });

    useEffect(() => {
        const getCustomers = async () => {
            setLoading(true);
            await serviceapp
                .get(`(WS_CARREGA_CLIENTE)?token=${user?.token}`)
                .then(response => {
                    const {data, message, token} = response?.data?.resposta;

                    setCustomers(data);
                    reset(data);
                })
                .catch(error => {
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        if (isFocused) {
            getCustomers();
        }
    }, [user, reset, isFocused]);

    const onSubmit: SubmitHandler<CustomerFormType> = async (
        data: CustomerFormType,
    ) => {
        setLoading(true);
        await serviceapp
            .get(
                `(WS_ALTERA_CLIENTE)?token=${user?.token}
      &nomeCliente=${data.nomeCliente}
      &enderecoCliente=${data.enderecoCliente}
      &cepCliente=${unMask(data.cepCliente.toString())}
      &cidadeCliente=${data.cidadeCliente}
      &ufCliente=${data.ufCliente}
      &celularCliente=${unMask(data.celularCliente)}
      &emailCliente=${data.emailCliente}
      &nascimentoCliente=${data.nascimentoCliente}`,
            )
            .then(response => {
                const {data, message, success, token} =
                    response?.data?.resposta;

                if (!success) {
                    setModalVisible(true);
                    setModalMessage(message);
                    setModalTitle('Erro!');
                    disconnect();
                    return;
                }

                setModalVisible(true);
                setModalMessage(message);
                setModalTitle('Minha conta');
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (loading) {
        return <AppLoading />;
    }

    const handleExcludeDataUser = () => {
        const message =
            'Iremos direciona-lo, para iniciar o processo de exclusão de dados.';
        Alert.alert('Exclusão de dados', message, [
            {
                text: 'Cancelar',
            },
            {
                text: 'Continuar',
                onPress: () =>
                    router.push({
                        pathname: '/data-exclude',
                        params: customers,
                    }),
            },
        ]);
    };

    return (
        <View className="bg-white ">
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
                    <View>
                        <ScreenHeader
                            title="Minha Conta"
                            subtitle="Alterar dados da minha conta"
                            classTitle="text-white text-2xl"
                            classSubtitle="text-white text-base text-center"
                        />
                        <View className="p-4 bg-white rounded-t-3xl">
                            <View className="flex-row items-center justify-between border-b border-gray-300 pb-4  ">
                                <Text>
                                    Solicitar a exclusão dos seus dados.
                                </Text>
                                <Button
                                    variant={'destructive'}
                                    size={'icon'}
                                    label={
                                        <UserMinus2Icon
                                            size={30}
                                            color={'white'}
                                        />
                                    }
                                    className="bg-solar-red-primary"
                                    labelClasses="p-2"
                                    style={{elevation: 4}}
                                    onPress={handleExcludeDataUser}
                                />
                            </View>
                            <View className="flex-col gap-4 my-4">
                                <Controller
                                    control={control}
                                    name="cpfcnpj"
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="CPF/CNPJ"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={
                                                    value &&
                                                    maskCpfCnpj(String(value))
                                                }
                                                readOnly
                                            />
                                        </View>
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="nomeCliente"
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="Nome completo"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                inputClasses={`${errors.nomeCliente ? '!border-solar-red-primary' : ''}`}
                                            />
                                        </View>
                                    )}
                                />
                                {errors.nomeCliente && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.nomeCliente?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    name="enderecoCliente"
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="Endereço"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                inputClasses={`${errors.enderecoCliente ? '!border-solar-red-primary' : ''}`}
                                            />
                                        </View>
                                    )}
                                />
                                {errors.enderecoCliente && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.enderecoCliente?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="CEP"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={
                                                    value &&
                                                    maskCep(String(value))
                                                }
                                                inputClasses={`${errors.cepCliente ? '!border-solar-red-primary' : ''}`}
                                            />
                                        </View>
                                    )}
                                    name="cepCliente"
                                />
                                {errors.cepCliente && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.cepCliente?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="Estado"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                inputClasses={`${errors.ufCliente ? '!border-solar-red-primary' : ''}`}
                                            />
                                        </View>
                                    )}
                                    name="ufCliente"
                                />
                                {errors.ufCliente && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.ufCliente?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="Cidade"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                inputClasses={`${errors.cidadeCliente ? '!border-solar-red-primary' : ''}`}
                                            />
                                        </View>
                                    )}
                                    name="cidadeCliente"
                                />
                                {errors.cidadeCliente && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.cidadeCliente?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="Celular"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={
                                                    value &&
                                                    maskPhone(String(value))
                                                }
                                                inputClasses={`${errors.celularCliente ? '!border-solar-red-primary' : ''}`}
                                            />
                                        </View>
                                    )}
                                    name="celularCliente"
                                />
                                {errors.celularCliente && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.celularCliente?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="E-mail"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                inputClasses={`${errors.emailCliente ? '!border-solar-red-primary' : ''}`}
                                            />
                                        </View>
                                    )}
                                    name="emailCliente"
                                />
                                {errors.emailCliente && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.emailCliente?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="Nascimento"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={
                                                    value &&
                                                    maskDate(String(value))
                                                }
                                                keyboardType="decimal-pad"
                                                inputClasses={`${errors.nascimentoCliente ? '!border-solar-red-primary' : ''}`}
                                            />
                                        </View>
                                    )}
                                    name="nascimentoCliente"
                                />
                                {errors.nascimentoCliente && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.nascimentoCliente?.message}
                                    </Text>
                                )}
                            </View>

                            <Button
                                label={'Alterar'}
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
