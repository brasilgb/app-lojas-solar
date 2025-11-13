import {
    View,
    Text,
    Pressable,
    Image,
    Alert,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenHeader from '@/components/ScreenHeader';
import { Card, CardContent, CardTitle } from '@/components/Card';
import { maskMoney } from '@/lib/mask';
import { CreditCardIcon } from 'lucide-react-native';
import serviceapp from '@/services/serviceapp';
import { useAuthContext } from '@/contexts/AppContext';

const methods = () => {
    const { user } = useAuthContext();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState<boolean>(false);

    const { dataOrder, totalAmount } = params;
    const order = JSON.parse(dataOrder as any);
    const mtoken = user?.token;

    const pixPaymentMethod = async () => {
        setLoading(true);
        try {
            const response = await serviceapp.post('(WS_ORDEM_PAGAMENTO)', {
                token: `${mtoken}`,
                valor: totalAmount,
                parcela: order,
                tipoPagamento: 4,
                validaDados: 'S',
                dadosCartao: {
                    numeroCartao: '',
                    nomeCartao: '',
                    validadeCartao: '',
                    cvvCartao: '',
                },
            });
            const { success, message, data, token } = response.data.resposta;

            router.push({
                pathname: '/(drawer)/(payment)/pixpayment',
                params: { valueOrder: totalAmount },
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Pagamentos"
                subtitle="Formas de pagamento"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-lg text-center"
            />
            <View className="p-4 bg-white rounded-t-3xl flex-1">
                <Card className="border border-gray-300 bg-white shadow-sm shadow-slate-950">
                    <CardTitle className="text-center p-4 text-lg font-medium text-gray-600">
                        Valor total do pagamento
                    </CardTitle>
                    <CardContent>
                        <Text className="text-center text-3xl font-bold">
                            R${' '}
                            {maskMoney(
                                parseFloat(totalAmount as string).toFixed(2),
                            )}
                        </Text>
                    </CardContent>
                </Card>

                <View className="py-4 mt-4">
                    <Text className="text-xl font-bold text-solar-blue-secondary text-center">
                        Escolha uma forma de pagamento
                    </Text>
                </View>

                <View className="flex-row justify-between gap-4">
                    <TouchableOpacity
                        onPress={pixPaymentMethod}
                        className="w-48 border border-gray-300 bg-white shadow-sm shadow-slate-950 rounded-lg"
                    >
                        <Card className="border-0">
                            <CardTitle className="text-center p-4 text-lg font-medium text-gray-600">
                                PIX
                            </CardTitle>
                            <CardContent className="items-center justify-center">
                                <Image
                                    source={require('@/assets/images/pix.png')}
                                    className="w-20 h-20"
                                />
                            </CardContent>
                        </Card>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: '/(drawer)/(payment)/cartpayment',
                                params: {
                                    dataOrder: JSON.stringify(order),
                                    totalAmount: totalAmount,
                                },
                            })
                        }
                        className="w-48 border border-gray-300 bg-white shadow-sm shadow-slate-950 rounded-lg"
                    >
                        <Card className="border-0">
                            <CardTitle className="text-center p-4 text-lg font-medium text-gray-600">
                                Cartão de Crédito
                            </CardTitle>
                            <CardContent className="items-center justify-center">
                                <CreditCardIcon size={70} color={'#0d3b85'} />
                            </CardContent>
                        </Card>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default methods;
