import AppLoading from '@/components/app-loading';
import {Button} from '@/components/Button';
import {Input} from '@/components/Input';
import MessageAlert from '@/components/MessageAlert';
import ScreenHeader from '@/components/ScreenHeader';
import {maskCep, maskCpfCnpj, maskDate, maskPhone, unMask} from '@/lib/mask';
import {CustomerFormType, customerSchema} from '@/schema/app';
import serviceapp from '@/services/serviceapp';
import {zodResolver} from '@hookform/resolvers/zod';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const RegisterCustomer = () => {
    const params = useLocalSearchParams<any>();

    const {bottom} = useSafeAreaInsets();
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalMessage, setModalMessage] = useState<string>('');
    const [modalTitle, setModalTitle] = useState<string>('');

    useEffect(() => {
        const getCustomers = async () => {
            // setLoading(true)
        };
        getCustomers();
    }, []);

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<CustomerFormType>({
        defaultValues: {
            cpfcnpj: params?.cpfcnpj,
        },
        resolver: zodResolver(customerSchema),
    });

    const onSubmit: SubmitHandler<CustomerFormType> = async (
        data: CustomerFormType,
    ) => {
        Keyboard.dismiss();
        setLoading(true);
        await serviceapp
            .get(
                `(WS_PRIMEIRO_ACESSO)?cpfcnpj=${data.cpfcnpj}
      &nomeCliente=${data.nomeCliente}
      &enderecoCliente=${data.enderecoCliente}
      &cepCliente=${unMask(data.cepCliente)}
      &cidadeCliente=${data.cidadeCliente}
      &ufCliente=${data.ufCliente}
      &celularCliente=${data.celularCliente}
      &emailCliente=${data.emailCliente}
      &nascimentoCliente=${data.nascimentoCliente}`,
            )
            .then(response => {
                const {success, message} = response.data.resposta;

                if (!success) {
                    setModalVisible(true);
                    setModalMessage(message);
                    setModalTitle('Erro!');
                }
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
                router.replace('/registered', {
                    cpfcnpj: params?.cpfcnpj,
                } as any);
            });
    };

    if (loading) {
        return <AppLoading />;
    }

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
                    <View>
                        <ScreenHeader
                            title="Cadastro de Cliente"
                            subtitle="Preencha o formulário corretamente."
                            classTitle="text-white text-2xl"
                            classSubtitle="text-white text-base text-center"
                        />
                        {loading && <AppLoading />}
                        <View className="p-4 bg-white rounded-t-3xl">
                            <View className="flex-col gap-4 my-4">
                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="CPF/CNPJ"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={maskCpfCnpj(value)}
                                                readOnly
                                            />
                                        </View>
                                    )}
                                    name="cpfcnpj"
                                />

                                <Controller
                                    control={control}
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
                                    name="nomeCliente"
                                />
                                {errors.nomeCliente && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.nomeCliente?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
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
                                    name="enderecoCliente"
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
                                                    maskCep(value.toString())
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
                                                value={maskPhone(value)}
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
                                                value={value && maskDate(value)}
                                                keyboardType="decimal-pad"
                                            />
                                        </View>
                                    )}
                                    name="nascimentoCliente"
                                />
                            </View>

                            <Button
                                label={'Cadastrar'}
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

export default RegisterCustomer;
