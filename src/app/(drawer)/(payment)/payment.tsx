import Button from '@/components/Button';
import ScreenHeader from '@/components/ScreenHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import { useAuthContext } from '@/contexts/AppContext';
import { maskMoney } from '@/lib/mask';
import serviceapp from '@/services/serviceapp';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { CheckIcon } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const OpenPayments = () => {
    const { user, disconnect } = useAuthContext();
    const [loading, setLoading] = useState<boolean>(false);

    const isFocused = useIsFocused();
    const [crediarios, setCrediarios] = useState<any[]>([]);
    const [selectedPayments, setSelectedPayments] = useState<any[]>([]);
    const [isAllChecked, setAllChecked] = useState(false);

    const mtoken = "0851324110172025045223708175110"

    useEffect(() => {
        const getCrediarios = async () => {
            setLoading(true);
            await serviceapp
                .get(`(WS_CARREGA_CREDIARIO)?token=${mtoken}`)
                .then((response: any) => {
                    const { data } = response.data.resposta;
                    setCrediarios(data.aberto || []); // Ensure crediarios is always an array
                })
                .catch((error: any) => {
                    // Interceptor will show an alert and redirect.
                    console.log('Failed to load crediarios:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        if (isFocused) {
            getCrediarios();
        }
    }, [user, isFocused, mtoken]);

    // Lidar com a seleção de um único pagamento
    const handleSelectPayment = (payment: any) => {
        setSelectedPayments(prevSelected => {
            const isSelected = prevSelected.some(p => p.numeroCarne === payment.numeroCarne && p.parcela === payment.parcela);
            if (isSelected) {
                return prevSelected.filter(p => !(p.numeroCarne === payment.numeroCarne && p.parcela === payment.parcela));
            } else {
                return [...prevSelected, payment];
            }
        });
    };

    // Lidar com a seleção de todos os pagamentos
    const handleSelectAll = () => {
        if (isAllChecked) {
            setSelectedPayments([]);
        } else {
            const allSelectable = crediarios.filter(c => c.status !== 'P');
            setSelectedPayments(allSelectable);
        }
    };

    // Sincronizar o estado de 'isAllChecked' com as seleções
    useEffect(() => {
        const allSelectable = crediarios.filter(c => c.status !== 'P');
        if (allSelectable.length > 0 && selectedPayments.length === allSelectable.length) {
            setAllChecked(true);
        } else {
            setAllChecked(false);
        }
    }, [selectedPayments, crediarios]);

    // Calcular totais dos pagamentos selecionados
    const { totalAmount, installmentsCount } = useMemo(() => {
        const total = selectedPayments.reduce((acc, payment) => acc + parseFloat(payment.total), 0);
        return {
            totalAmount: total,
            installmentsCount: selectedPayments.length,
        };
    }, [selectedPayments]);


    const RenderItem = ({ crediario }: any) => {
        const isSelected = selectedPayments.some(p => p.numeroCarne === crediario.numeroCarne && p.parcela === crediario.parcela);

        return (
            <TouchableOpacity
                onPress={() => handleSelectPayment(crediario)}
                className={`flex-row items-center justify-between my-1 px-2 rounded-xl text-lg leading-6 font-medium bg-white border border-gray-300 shadow-sm ${Platform.OS === 'ios' ? 'shadow-gray-200' : 'shadow-gray-400'
                    } py-4 `}
                disabled={crediario.status === 'P'}
            >
                <View className="flex-row items-center justify-center w-full">
                    <View className="flex-none items-center justify-start w-8">
                        {crediario.status === 'P' ? (
                            <MaterialIcons name="schedule" size={28} color={'#5d71af'} />
                        ) : (
                            <View
                                className={`h-6 w-6 border-2 border-solar-orange-primary ${isSelected ? 'bg-solar-orange-primary' : 'bg-transparent'} items-center justify-center rounded-full`}
                            >
                                {isSelected && (
                                    <CheckIcon size={18} color="white" />
                                )}
                            </View>
                        )}
                    </View>
                    <View className="flex-1 flex-col items-start">
                        <View className="flex-row">
                            <View className="flex-1 pl-2">
                                <Text className="text-xs font-medium pb-1" >
                                    Núm. do contrato
                                </Text>
                                <Text className="text-sm font-PoppinsMedium" >
                                    {crediario.numeroCarne}
                                </Text>
                                <Text className="text-xs font-medium"  >
                                    {crediario.vencimento}
                                </Text>
                                <Text
                                    allowFontScaling={false}
                                    className="text-sm font-medium pt-1"
                                >
                                    Parcela {crediario.parcela.replace('/', ' de ')}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <View className={`${crediario.status === 'P'
                                            ? 'bg-solar-violet'
                                            : crediario.atraso > 0
                                                ? 'bg-solar-orange-secondary'
                                                : ''
                                        }  rounded items-center justify-center mb-1 ml-4`}
                                >
                                    <Text
                                        className={`text-xs font-medium ${crediario.status === 'P' ? 'text-white' : 'text-white'
                                            }`}
                                    >
                                        {crediario.status === 'P'
                                            ? 'Processando'
                                            : crediario.atraso > 0
                                                ? 'Atrasada'
                                                : ''}
                                    </Text>
                                </View>
                                <View
                                    className={`flex-col items-end justify-around ${crediario.acrescimo > 0 ? '' : 'mt-4'
                                        }`}
                                >
                                    <Text
                                        allowFontScaling={false}
                                        className="text-base text-gray-400 font-medium"
                                    >
                                        Valor:{' '}
                                        {maskMoney(crediario.vlprest)}
                                    </Text>
                                    {crediario.acrescimo > 0 && (
                                        <Text
                                            allowFontScaling={false}
                                            className="text-xs text-red-500 font-medium"
                                        >
                                            Juros:{' '}
                                            {maskMoney(crediario.acrescimo)}
                                        </Text>
                                    )}
                                    <Text
                                        allowFontScaling={false}
                                        className="text-lg font-PoppinsBold text-solar-blue-dark"
                                    >
                                        {maskMoney(crediario.total)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Meus pagamentos"
                subtitle="Efetue pagamentos e verifique o histórico de pagamentos"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-lg text-center"
            />
            <View className="p-4 bg-white rounded-t-3xl flex-1">
                <Tabs defaultValue="opened">
                    <TabsList>
                        <TabsTrigger id="opened" title="Em aberto" value={'opened'} />
                        <TabsTrigger id="history" title="Histórico" value={'history'} />
                    </TabsList>
                    <View className="w-full py-6">
                        <TouchableOpacity
                            className="flex-row items-center justify-start"
                            onPress={handleSelectAll}
                        >
                            <View
                                className={`h-6 w-6 items-center justify-center rounded-full border-2 border-solar-orange-primary ${isAllChecked ? 'bg-solar-orange-primary' : 'bg-transparent'
                                    }`}
                            >
                                {isAllChecked && (
                                    <CheckIcon size={22} color="white" />
                                )}
                            </View>
                            <Text
                                allowFontScaling={false}
                                className="ml-2 text-base font-medium text-solar-yellow-dark"
                            >
                                Selecionar todos
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TabsContent value="opened" className="flex-1">
                        <FlashList
                            data={crediarios}
                            renderItem={({ item }) => (
                                <RenderItem crediario={item} />
                            )}
                            keyExtractor={(item: any) => item.numeroCarne + item.parcela}
                            ItemSeparatorComponent={() => (
                                <View className="h-0.5 bg-solar-gray-dark" />
                            )}
                            extraData={selectedPayments}
                            showsVerticalScrollIndicator={false}
                            // Deixe um espaço na parte inferior para o rodapé de totais
                            contentContainerStyle={{ paddingBottom: 100 }}
                        />
                    </TabsContent>
                    <TabsContent value="history">
                        <Text className="text-gray-500">
                            Change your password here.
                        </Text>
                    </TabsContent>
                </Tabs>
            </View>

            {/* Rodapé de Totais e Pagamento */}
            {installmentsCount > 0 && (
                <View
                    className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200"
                    style={{ elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 2 }}
                >
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text className="text-lg font-PoppinsMedium text-gray-700">
                                {installmentsCount} {installmentsCount > 1 ? 'parcelas selecionadas' : 'parcela selecionada'}
                            </Text>
                            <Text className="text-2xl font-PoppinsBold text-solar-blue-dark">
                                Total: {maskMoney(String(totalAmount))}
                            </Text>
                        </View>
                        <View className="w-36">
                            <Button
                                title="Pagar"
                                onPress={() => router.push('/(drawer)/(payment)/methods')}
                            />
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export default OpenPayments;