import AppDateTimePicker from '@/components/AppDateTimePicker';
import {useAuthContext} from '@/contexts/AppContext';
import {maskMoney} from '@/lib/mask';
import serviceapp from '@/services/serviceapp';
import {FlashList} from '@shopify/flash-list';
import {useFocusEffect} from 'expo-router';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, Platform, Text, View} from 'react-native';

const PaymentHistory = () => {
    const {user} = useAuthContext();
    const [crediarios, setCrediarios] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    let dataAtual = new Date();
    let dataAnterior = new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth() - 6,
        dataAtual.getDate(),
    );
    const [dateIni, setDateIni] = useState(dataAnterior);
    const [dateFin, setDateFin] = useState(dataAtual);

    const getCrediarios = async () => {
        setLoading(true);
        await serviceapp
            .get(
                `(WS_CARREGA_CREDIARIO)?token=${user?.token}&tipo=H&dataInicial=${moment(
                    dateIni,
                ).format('YYYYMMDD')}&dataFinal=${moment(dateFin).format(
                    'YYYYMMDD',
                )}`,
            )
            .then(response => {
                const {success, message, token, data} = response.data.resposta;
                setLoading(false);
                setCrediarios(data.historico);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useFocusEffect(
        useCallback(() => {
            getCrediarios();
        }, []),
    );

    const RenderItem = ({item}: any) => {
        return (
            <View className="flex-row items-center justify-between mx-1 my-1.5 px-2 rounded-xl text-lg font-normal bg-gray-50 border border-gray-200 shadow-md shadow-gray-800 py-4">
                <View className="flex-row items-center justify-center w-full">
                    <View className="flex-1 flex-col items-start">
                        <View className="flex-row">
                            <View className="w-3/5 pl-2">
                                <Text className="text-sm font-normal pb-1">
                                    Parcela da compra
                                </Text>
                                <Text className="text-lg font-medium">
                                    {item?.numeroCarne}
                                </Text>
                                <Text className="text-sm font-normal">
                                    {item?.pagamento}
                                </Text>
                            </View>
                            <View className="w-2/5 flex items-center justify-between">
                                <View />
                                <View className="flex items-end">
                                    <Text className="text-base font-normal pt-1">
                                        Parcela {item?.parcela}
                                    </Text>
                                    <Text className="text-xl font-Poppins_700Bold font-semibold mt-2 text-solar-blue-dark">
                                        R${' '}
                                        {maskMoney(
                                            parseFloat(item?.vPago).toFixed(2),
                                        )}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const totalCrediario = crediarios
        ?.reduce(
            (total: any, valor: any) => (total += parseFloat(valor.vPago)),
            0,
        )
        .toFixed(2);

    return (
        <>
            <View className="flex-row justify-between mb-2 px-4">
                <View className="items-center gap-2">
                    {/* <Text className='text-lg font-semibold text-gray-600'>Data Inicial</Text> */}
                    <AppDateTimePicker value={dateIni} onChange={setDateIni} />
                </View>
                <View className="items-center gap-2">
                    {/* <Text className='text-lg font-semibold text-gray-600'>Data Final</Text> */}
                    <AppDateTimePicker value={dateFin} onChange={setDateFin} />
                </View>
            </View>

            {crediarios && crediarios?.length < 1 && (
                <View className="flex-col my-6 px-4">
                    <View className="w-full flex-col items-center justify-center py-6">
                        <Image
                            source={require('@/assets/images/no_payments_logo.png')}
                            className="w-[172px] h-[139px] "
                        />
                        <Text className="text-lg font-medium text-solar-blue-secondary mt-4 px-3 text-center">
                            Você não possui nenhum pagamento para este período.
                        </Text>
                    </View>
                </View>
            )}
            {crediarios && crediarios?.length > 0 && (
                <View className="flex-1 px-4">
                    <View className="mb-2 bg-solar-blue-primary rounded-lg w-full flex-row border border-white">
                        <Text className="text-white text-base font-semibold flex-1 px-4 py-2">
                            Total do período:{' '}
                        </Text>
                        <Text className="bg-solar-green-primary text-solar-blue-secondary text-base font-bold py-2 px-4 rounded-r-md">
                            R$ {maskMoney(totalCrediario)}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <FlashList
                            data={crediarios}
                            renderItem={RenderItem}
                            keyExtractor={(item: any) =>
                                item.numeroCarne + item.parcela
                            }
                            showsVerticalScrollIndicator={false}
                            // contentContainerStyle={{ paddingBottom: 5 }}
                            keyboardShouldPersistTaps={'always'}
                            onRefresh={getCrediarios}
                            refreshing={loading}
                        />
                    </View>
                </View>
            )}
        </>
    );
};

export default PaymentHistory;
