import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import serviceapp from '@/services/serviceapp';
import {maskMoney} from '@/lib/mask';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function ListItemsModal({modalData}: any) {
    const [loading, setLoading] = useState<boolean>(false);
    const [itensNota, setItensNota] = useState<any>([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        const getItensNota = async () => {
            setLoading(true);
            await serviceapp
                .post('(WS_CONSULTA_NF_CASHBACK)', {
                    orige: modalData.orige,
                    serie: modalData.serie,
                    numnf: modalData.numnf,
                })
                .then(response => {
                    setItensNota(response.data.respnfcash.data);
                })
                .catch(error => {
                    console.log('error', error);
                })
                .finally(() => setLoading(false));
        };
        if (isFocused) {
            getItensNota();
        }
    }, [modalData, isFocused]);

    return (
        <SafeAreaView className="flex-1">
            <View className="flex-1 px-4">
                <ScrollView className="border-t mt-4 py-2 border-gray-300">
                    {!loading &&
                        itensNota?.map((inf: any, idx: number) => (
                            <View
                                key={idx}
                                className="flex-col bg-solar-blue-primary rounded-md p-2 my-1"
                            >
                                <View className="flex-row items-center justify-between mb-1 border-b border-white/20 pb-1">
                                    <Text className="flex-1 text-sm font-semibold text-white border-r border-white/20 pr-1.5">
                                        Item: {inf.item}
                                    </Text>
                                    <Text className="px-2 text-sm font-semibold text-white">
                                        Valor: {maskMoney(`${inf.valor}}`)}
                                    </Text>
                                </View>
                                <Text className="text-sm font-semibold text-white">
                                    Descrição: {inf.desite}
                                </Text>
                            </View>
                        ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
