import { View, Text, Alert, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '@/contexts/AppContext';
import serviceapp from '@/services/serviceapp';
import AppLoading from '@/components/app-loading';
import ScreenHeader from '@/components/ScreenHeader';
import { useLocalSearchParams } from 'expo-router';
import { maskMoney } from '@/lib/mask';

const HistoryItens = () => {
    const params = useLocalSearchParams();
    const dataItem = params as any;
    const { user, disconnect } = useAuthContext();
    const [historicoItems, setHistoricoItems] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getHistoricoItems = async () => {
            setLoading(true);
            await serviceapp.get(
                `(WS_HISTORICO_ITENS)?token=${user?.token}&numero=${dataItem?.numero}&filial=${dataItem?.filial}&serie=${dataItem?.serie}`,
            )
                .then(response => {
                    const { success, message, data } = response.data.resposta;
                    setLoading(false);
                    if (!success) {
                        Alert.alert('Atenção', message, [
                            {
                                text: 'Ok',
                                onPress: () => {
                                    disconnect();
                                },
                            },
                        ]);
                    }
                    setHistoricoItems(data);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getHistoricoItems();
    }, [user, dataItem]);

    if (loading) {
        <AppLoading />;
    }

    return (
        <View className='bg-solar-blue-primary flex-1'>
            <ScreenHeader
                title="Detalhes da compra"
                subtitle="Documentos disponíveis para assinatura"
                classTitle='text-white text-2xl'
                classSubtitle='text-white text-lg text-center'
            />
            <View className='p-4 bg-gray-100 rounded-t-3xl h-full gap-4'>
                <View className="flex-1 items-center justify-start bg-solar-gray-dark px-2">
                    <View className="flex-col items-center justify-center w-full px-2">

                        <View className="flex-1 bg-solar-gray-dark pt-8 px-4">
                            <View
                                className={`flex-row items-center justify-between bg-gray-white my-1 px-2 rounded-xl text-lg leading-6 font-medium bg-white border border-gray-300 shadow-sm`}
                >
                                <View className="w-full flex-row items-center justify-between mb-2">
                                    <Text
                                        allowFontScaling={false}
                                        className="flex-1 text-xl font-PoppinsRegular"
                                    >
                                        N° da compra:{' '}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        className="flex-1 text-lg font-PoppinsBold text-right"
                                    >
                                        {dataItem?.numero}
                                    </Text>
                                </View>
                                <View className="w-full flex-row items-center justify-between">
                                    <Text
                                        allowFontScaling={false}
                                        className="text-base font-PoppinsRegular flex-1"
                                    >
                                        Data: {dataItem?.data}
                                    </Text>
                                    <Text
                                        allowFontScaling={false}
                                        className="text-xl font-PoppinsBold text-solar-blue-dark flex-1 text-right"
                                    >
                                        {maskMoney((dataItem?.valor))}
                                    </Text>
                                </View>
                            </View>
                            {historicoItems &&
                                historicoItems.map((item: any, idx: number) => (
                                    <View
                                        key={idx}
                                        className={`flex-row items-center justify-between bg-gray-white my-1 px-2 rounded-xl text-lg leading-6 font-medium bg-white border border-gray-300 shadow-sm`}
                >
                                        <View className="flex-1">
                                            <Image
                                                source={{ uri: item?.linkImagem }}
                                                className="h-40 w-40 rounded-l-lg"
                                            />
                                        </View>
                                        <View className="flex-1 pl-2">
                                            <Text
                                                allowFontScaling={false}
                                                className="text-base font-PoppinsBold"
                                            >
                                                {item?.descricao}
                                            </Text>
                                            <Text
                                                allowFontScaling={false}
                                                className="text-right my-1 font-PoppinsMedium text-gray-500 py-1"
                                            >
                                                {parseInt(item?.quantidade)} un x{' '}
                                                {maskMoney((item?.unitario))}
                                            </Text>
                                            <Text
                                                allowFontScaling={false}
                                                className="text-right text-lg text-solar-blue-dark font-PoppinsBold"
                                            >
                                                {maskMoney((item?.total))}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default HistoryItens;
