import {Button} from '@/components/Button';
import ScreenHeader from '@/components/ScreenHeader';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/Tabs';
import {useAuthContext} from '@/contexts/AppContext';
import {maskMoney} from '@/lib/mask';
import serviceapp from '@/services/serviceapp';
import {FlashList} from '@shopify/flash-list';
import {router, useFocusEffect} from 'expo-router';
import {CheckIcon, ClockIcon} from 'lucide-react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Platform, Text, TouchableOpacity, View, Image} from 'react-native';
import PaymentHistory from './payment-history';

const OpenPayments = () => {
    const {user} = useAuthContext();
    const [loading, setLoading] = useState<boolean>(false);
    const mtoken = user?.token;
    const [crediarios, setCrediarios] = useState<any>([]);
    const [selectedPayments, setSelectedPayments] = useState<any>([]);
    const [isAllChecked, setAllChecked] = useState(false);

    const getCrediarios = async () => {
        setAllChecked(false);
        setSelectedPayments([]);
        setLoading(true);
        await serviceapp
            .get(`(WS_CARREGA_CREDIARIO)?token=${mtoken}`)
            .then((response: any) => {
                const {data} = response.data.resposta;
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

    useFocusEffect(
        useCallback(() => {
            getCrediarios();
        }, []),
    );

    // Lidar com a seleção de um único pagamento
    const handleSelectPayment = (payment: any) => {
        setSelectedPayments((prevSelected: any) => {
            const isSelected = prevSelected.some(
                (p: any) =>
                    p.numeroCarne === payment.numeroCarne &&
                    p.parcela === payment.parcela,
            );
            if (isSelected) {
                return prevSelected.filter(
                    (p: any) =>
                        !(
                            p.numeroCarne === payment.numeroCarne &&
                            p.parcela === payment.parcela
                        ),
                );
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
            const allSelectable = crediarios.filter(
                (c: any) => c.status !== 'P',
            );
            setSelectedPayments(allSelectable);
        }
    };

    // Sincronizar o estado de 'isAllChecked' com as seleções
    useEffect(() => {
        const allSelectable = crediarios.filter((c: any) => c.status !== 'P');
        if (
            allSelectable.length > 0 &&
            selectedPayments.length === allSelectable.length
        ) {
            setAllChecked(true);
        } else {
            setAllChecked(false);
        }
    }, [selectedPayments, crediarios]);

    // Calcular totais dos pagamentos selecionados
    const {totalAmount, installmentsCount} = useMemo(() => {
        const total = selectedPayments.reduce(
            (acc: any, payment: any) => acc + parseFloat(payment.total),
            0,
        );
        return {
            totalAmount: total,
            installmentsCount: selectedPayments.length,
        };
    }, [selectedPayments]);

    const RenderItem = ({crediario}: any) => {
        const isSelected = selectedPayments.some(
            (p: any) =>
                p.numeroCarne === crediario.numeroCarne &&
                p.parcela === crediario.parcela,
        );

        return (
            <TouchableOpacity
                onPress={() => handleSelectPayment(crediario)}
                className="flex-row items-center justify-between my-1 px-2 rounded-xl text-lg leading-6 font-medium bg-white border border-gray-300 shadow-sm shadow-gray-200 py-4"
                disabled={crediario.status === 'P'}
            >
                <View className="flex-row items-center justify-center w-full">
                    <View className="flex-none items-center justify-start w-8">
                        {crediario.status === 'P' ? (
                            <ClockIcon size={24} color={'#5d71af'} />
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
                                <Text className="text-xs font-medium pb-1">
                                    Núm. do contrato
                                </Text>
                                <Text className="text-sm font-PoppinsMedium">
                                    {crediario.numeroCarne}
                                </Text>
                                <Text className="text-xs font-medium">
                                    {crediario.vencimento}
                                </Text>
                                <Text className="text-sm font-medium pt-1">
                                    Parcela{' '}
                                    {crediario.parcela.replace('/', ' de ')}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <View
                                    className={`${
                                        crediario.status === 'P'
                                            ? 'bg-solar-violet'
                                            : crediario.atraso > 0
                                              ? 'bg-solar-orange-secondary'
                                              : ''
                                    }  rounded items-center justify-center mb-1 ml-4`}
                                >
                                    <Text
                                        className={`text-xs font-medium ${
                                            crediario.status === 'P'
                                                ? 'text-white'
                                                : 'text-white'
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
                                    className={`flex-col items-end justify-around ${
                                        crediario.acrescimo > 0 ? '' : 'mt-4'
                                    }`}
                                >
                                    <Text className="text-base text-gray-400 font-medium">
                                        Valor:{' R$ '}
                                        {maskMoney(crediario.vlprest)}
                                    </Text>
                                    {crediario.acrescimo > 0 && (
                                        <Text className="text-xs text-red-500 font-medium">
                                            Juros:{' R$ '}
                                            {maskMoney(crediario.acrescimo)}
                                        </Text>
                                    )}
                                    <Text className="text-lg font-PoppinsBold text-solar-blue-dark">
                                        R$ {maskMoney(crediario.total)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const FooterPaymentTotal = () => (
        <View
            className="absolute bottom-0 left-0 right-0 bg-solar-blue-primary p-4 border-t border-gray-200"
            style={{
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: -2},
                shadowOpacity: 0.1,
                shadowRadius: 2,
            }}
        >
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="text-lg font-medium text-white">
                        {installmentsCount}{' '}
                        {installmentsCount > 1
                            ? 'parcelas selecionadas'
                            : 'parcela selecionada'}
                    </Text>
                    <Text className="text-2xl font-bold text-white">
                        Total: R${' '}
                        {maskMoney(String((totalAmount || 0).toFixed(2)))}
                    </Text>
                </View>
                <View className="w-36 h-full flex items-center justify-center">
                    <Button
                        size="lg"
                        variant="secondary"
                        label="Pagar"
                        onPress={() =>
                            router.push({
                                pathname: '/(drawer)/(payment)/methods',
                                params: {
                                    dataOrder: JSON.stringify(selectedPayments),
                                    totalAmount: totalAmount,
                                },
                            })
                        }
                    />
                </View>
            </View>
        </View>
    );

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Meus pagamentos"
                subtitle="Efetue pagamentos e verifique o histórico de pagamentos"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-lg text-center"
            />
            <View className="bg-white rounded-t-3xl flex-1">
                <Tabs defaultValue="opened">
                    <TabsList className="p-4">
                        <TabsTrigger
                            id="opened"
                            title="Em aberto"
                            value={'opened'}
                        />
                        <TabsTrigger
                            id="history"
                            title="Histórico"
                            value={'history'}
                        />
                    </TabsList>

                    <TabsContent value="opened" className="flex-1 border-0">
                        <View className="px-4 flex-1">
                            <View className="w-full py-6 px-4">
                                <TouchableOpacity
                                    className="flex-row items-center justify-start"
                                    onPress={handleSelectAll}
                                >
                                    <View
                                        className={`h-6 w-6 items-center justify-center rounded-full border-2 border-solar-orange-primary ${
                                            isAllChecked
                                                ? 'bg-solar-orange-primary'
                                                : 'bg-transparent'
                                        }`}
                                    >
                                        {isAllChecked && (
                                            <CheckIcon
                                                size={22}
                                                color="white"
                                            />
                                        )}
                                    </View>
                                    <Text className="ml-2 text-base font-medium text-solar-yellow-dark">
                                        Selecionar todos
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <FlashList
                                data={crediarios}
                                renderItem={({item}) => (
                                    <RenderItem crediario={item} />
                                )}
                                keyExtractor={(item: any) =>
                                    item.numeroCarne + item.parcela
                                }
                                extraData={selectedPayments}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={
                                    installmentsCount > 0 && {paddingBottom: 90}
                                }
                                keyboardShouldPersistTaps={'always'}
                                onRefresh={getCrediarios}
                                refreshing={loading}
                            />
                        </View>
                        {/* Rodapé de Totais e Pagamento */}
                        {installmentsCount > 0 && <FooterPaymentTotal />}
                    </TabsContent>
                    <TabsContent value="history" className="border-0 flex-1">
                        <PaymentHistory />
                    </TabsContent>
                </Tabs>
            </View>
        </View>
    );
};

export default OpenPayments;
