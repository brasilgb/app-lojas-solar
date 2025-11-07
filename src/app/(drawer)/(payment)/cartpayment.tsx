import {Button} from '@/components/Button';
import {Card, CardContent, CardTitle} from '@/components/Card';
import {Input} from '@/components/Input';
import ScreenHeader from '@/components/ScreenHeader';
import {useAuthContext} from '@/contexts/AppContext';
import {getCardBrandName} from '@/lib/creditcart';
import {maskCreditCart, maskDateValidate, maskMoney, unMask} from '@/lib/mask';
import {CartPaymentFormType, CartPaymentSchema} from '@/schema/app';
import serviceapp from '@/services/serviceapp';
import servicecart from '@/services/servicecart';
import {zodResolver} from '@hookform/resolvers/zod';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const CartPayment = () => {
    const {user, disconnect} = useAuthContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [registeredOrder, setRegisteredOrder] = useState<any>([]);
    const {bottom} = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const order = JSON.parse(params?.dataOrder as any);
    const mtoken = user?.token;
    const orderTotal = parseFloat(String(params?.totalAmount)).toFixed(2);

    const orderCartPayment = async (valueCart: CartPaymentFormType) => {
        setLoading(true);
        if (registeredOrder.length === 0) {
            const response = await serviceapp.post('(WS_ORDEM_PAGAMENTO)', {
                token: `${mtoken}`,
                valor: orderTotal,
                parcela: order,
                tipoPagamento: 2,
                validaDados: 'S',
                dadosCartao: {
                    numeroCartao: `${maskCreditCart(valueCart?.numeroCartao)}`,
                    nomeCartao: `${valueCart?.nomeCartao}`,
                    validadeCartao: `${maskDateValidate(valueCart?.validadeCartao)}`,
                    cvvCartao: `${valueCart?.cvvCartao}`,
                },
            });
            const {success, message, data} = response.data.resposta;
            console.log('Aqui é o registra ordem', response.data.resposta);
            setRegisteredOrder(data);
            if (!success) {
                Alert.alert('Atenção deu erro', message, [{text: 'Ok'}]);
            }
            await paymentCart(data);
        } else {
            // Caso o cartão tenha dado erro de comunicação guarda os dados do formuláio e reenvia
            console.log('registerorder ok', registeredOrder);
            await paymentCart(registeredOrder);
        }
    };

    const paymentCart = async (dataCart: any) => {
        const response = await servicecart.post(`(PAG_CARTAO_CREDITO)`, {
            MerchantOrderId: dataCart.numeroOrdem,
            Payment: {
                Type: 'CreditCard',
                Amount: Number(dataCart.valorOrdem) * 100,
                // Amount: 1,
                Currency: 'BRL',
                Country: 'BRA',
                Provider: 'Cielo',
                ServiceTaxAmount: 0,
                Installments: 1,
                Interest: 'ByMerchant',
                Capture: true,
                Authenticate: false,
                Recurrent: false,
                SoftDescriptor: '123456789ABCD',
                CreditCard: {
                    CardNumber: unMask(dataCart.dadosCartao.numeroCartao),
                    Holder: dataCart.dadosCartao.nomeCartao,
                    ExpirationDate: dataCart.dadosCartao.validadeCartao,
                    SecurityCode: dataCart.dadosCartao.cvvCartao,
                    SaveCard: false,
                    Brand: getCardBrandName(dataCart.dadosCartao.numeroCartao),
                },
            },
        });
        const {success, ReturnMessage, ReturnCode, data} =
            response.data.response;
        console.log('Aqui é o cartão', response.data.response);
        if (success && ReturnCode !== '00') {
            Alert.alert('Atenção', ReturnMessage, [{text: 'Ok'}]);
        }
        // Aqui atualiza a ordem de pagamento caso de certo
        await sendOrderAtualize(response.data.response);
    };

    const sendOrderAtualize = async (dataCart: any) => {
        const response = await serviceapp.get(
            `(WS_ATUALIZA_ORDEM)?token=91362590064312210014616&numeroOrdem=${dataCart.MerchantOrderId}&statusOrdem=2&idTransacao=${dataCart.PaymentId}&tipoPagamento=2&urlBoleto=${dataCart.AuthorizationCode}`,
        );
        const {success} = response.data.resposta;
        console.log('Aqui atualiza a ordem', response.data.resposta);
        setRegisteredOrder([]);
        if (success) {
            router.replace('/cardbillpaid');
        }
    };

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<CartPaymentFormType>({
        defaultValues: {
            numeroCartao: '',
            nomeCartao: '',
            validadeCartao: '',
            cvvCartao: '',
        },
        resolver: zodResolver(CartPaymentSchema),
    });

    const onSubmit = async (values: CartPaymentFormType) => {
        await orderCartPayment(values);
        setLoading(false);
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
                    style={{paddingBottom: bottom}}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1">
                        <ScreenHeader
                            title="Pagamento"
                            subtitle="Preencha corretamente os dados do cartão de crédito"
                            classTitle="text-white text-2xl"
                            classSubtitle="text-white text-base text-center"
                        />
                        <View className="p-4 bg-white rounded-t-3xl h-full">
                            <Card className="border border-gray-300 bg-white shadow-sm shadow-slate-950 mb-4">
                                <CardTitle className="text-center p-4 text-lg font-medium text-gray-600">
                                    Valor total do pagamento
                                </CardTitle>
                                <CardContent>
                                    <Text className="text-center text-3xl font-bold">
                                        R${' '}
                                        {maskMoney(
                                            parseFloat(
                                                orderTotal as string,
                                            ).toFixed(2),
                                        )}
                                    </Text>
                                </CardContent>
                            </Card>
                            <View className="flex-col gap-4 my-4">
                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="Número do cartão de crédito"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={maskCreditCart(value)}
                                                inputClasses={`${errors.numeroCartao ? '!border-solar-red-primary' : ''}`}
                                                maxLength={19}
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    )}
                                    name="numeroCartao"
                                />
                                {errors.numeroCartao && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.numeroCartao?.message}
                                    </Text>
                                )}

                                <Controller
                                    control={control}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <Input
                                                label="Nome impresso no cartão"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                                inputClasses={`${errors.nomeCartao ? '!border-solar-red-primary' : ''}`}
                                                autoCapitalize="characters"
                                            />
                                        </View>
                                    )}
                                    name="nomeCartao"
                                />
                                {errors.nomeCartao && (
                                    <Text className="text-solar-red-primary -mt-4">
                                        {errors.nomeCartao?.message}
                                    </Text>
                                )}

                                <View className="flex-row items-center justify-between gap-4">
                                    <View className="flex-1">
                                        <Controller
                                            control={control}
                                            render={({
                                                field: {
                                                    onChange,
                                                    onBlur,
                                                    value,
                                                },
                                            }) => (
                                                <View>
                                                    <Input
                                                        label="Validade"
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        value={maskDateValidate(
                                                            value,
                                                        )}
                                                        inputClasses={`${errors.validadeCartao ? '!border-solar-red-primary' : ''} placeholder:text-gray-700`}
                                                        maxLength={7}
                                                        placeholder="12/2025"
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            )}
                                            name="validadeCartao"
                                        />
                                        {errors.validadeCartao && (
                                            <Text className="text-solar-red-primary mt-0">
                                                {errors.validadeCartao?.message}
                                            </Text>
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <Controller
                                            control={control}
                                            render={({
                                                field: {
                                                    onChange,
                                                    onBlur,
                                                    value,
                                                },
                                            }) => (
                                                <View>
                                                    <Input
                                                        label="Código CVV"
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        value={value}
                                                        inputClasses={`${errors.cvvCartao ? '!border-solar-red-primary' : ''}`}
                                                        maxLength={4}
                                                        keyboardType="numeric"
                                                    />
                                                </View>
                                            )}
                                            name="cvvCartao"
                                        />
                                        {errors.cvvCartao && (
                                            <Text className="text-solar-red-primary mt-0">
                                                {errors.cvvCartao?.message}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>

                            <Button
                                label={
                                    loading ? (
                                        <ActivityIndicator
                                            size="small"
                                            color="#bccf00"
                                        />
                                    ) : (
                                        'Continuar'
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

export default CartPayment;
