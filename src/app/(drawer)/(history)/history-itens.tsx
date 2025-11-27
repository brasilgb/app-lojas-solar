import AppLoading from '@/components/app-loading';
import ScreenHeader from '@/components/ScreenHeader';
import {useAuthContext} from '@/contexts/AppContext';
import {maskMoney} from '@/lib/mask';
import serviceapp from '@/services/serviceapp';
import {useLocalSearchParams} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {Image, Text, View} from 'react-native';

const HistoryItens = () => {
    const {user} = useAuthContext();
    const params = useLocalSearchParams();
    const {dataHistory} = params as any;
    const history = JSON.parse(dataHistory);
    const [historicoItems, setHistoricoItems] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getHistoricoItems = async () => {
            setLoading(true);
            await serviceapp
                .get(
                    `(WS_HISTORICO_ITENS)?token=${user?.token}&numero=${history?.numero}&filial=${history?.filial}&serie=${history?.serie}`,
                )
                .then(response => {
                    const {success, message, data} = response.data.resposta;
                    setLoading(false);
                    setHistoricoItems(data);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getHistoricoItems();
    }, [user]);

    if (loading) {
        <AppLoading />;
    }

    return (
        <View className="bg-solar-blue-primary ">
            <ScreenHeader
                title="Histórico de compras"
                subtitle="Detalhes da compra"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className="p-4 bg-gray-100 rounded-t-3xl h-full gap-4">
                <View className=" bg-solar-gray-dark">
                    <View
                        className={`flex-col items-center justify-between bg-gray-white mb-1 p-4 rounded-xl text-lg leading-6 font-medium bg-white border border-gray-300 shadow-sm`}
                    >
                        <View className="flex-row items-center justify-start mb-2 w-full">
                            <Text className=" text-xl font-PoppinsRegular">
                                N° da compra:{' '}
                            </Text>
                            <Text className="text-lg font-bold text-right">
                                {history?.numero}
                            </Text>
                        </View>
                        <View className="flex-row items-center justify-between w-full">
                            <Text className="text-base font-PoppinsRegular">
                                Data: {history?.data}
                            </Text>
                            <Text className="text-xl font-bold text-solar-blue-dark  text-right">
                                R$ {maskMoney(history?.valor)}
                            </Text>
                        </View>
                    </View>
                    {historicoItems &&
                        historicoItems.map((item: any, idx: number) => (
                            <View
                                key={idx}
                                className={`flex-row items-center justify-between bg-gray-white my-1 p-2 rounded-xl text-lg leading-6 font-medium bg-white border border-gray-300 shadow-sm`}
                            >
                                <View className="border border-gray-300 rounded-lg">
                                    <Image
                                        source={{uri: item?.linkImagem}}
                                        className="h-40 w-40 rounded-l-lg"
                                    />
                                </View>
                                <View className="pl-2 flex-1 flex-col">
                                    <Text className="text-base font-bold">
                                        {item?.descricao}
                                    </Text>
                                    <Text className="my-1 font-PoppinsMedium text-gray-500 py-1">
                                        {parseInt(item?.quantidade)} un x R${' '}
                                        {maskMoney(
                                            String(
                                                parseFloat(
                                                    item?.unitario,
                                                ).toFixed(2),
                                            ),
                                        )}
                                    </Text>
                                    <Text className="text-2xl text-center text-solar-blue-secondary font-bold">
                                        R$ {maskMoney(item?.total)}
                                    </Text>
                                </View>
                            </View>
                        ))}
                </View>
            </View>
        </View>
    );
};

export default HistoryItens;
