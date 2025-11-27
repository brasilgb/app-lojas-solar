import ScreenHeader from '@/components/ScreenHeader';
import {useAuthContext} from '@/contexts/AppContext';
import {maskMoney} from '@/lib/mask';
import serviceapp from '@/services/serviceapp';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {FlashList} from '@shopify/flash-list';
import {router, useFocusEffect} from 'expo-router';
import moment from 'moment';
import React, {useCallback, useState} from 'react';
import {
    Alert,
    Image,
    Platform,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';

const History = () => {
    const {user} = useAuthContext();
    const [historicos, setHistoricos] = useState<any>([]);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const showPicker = useCallback((value: any) => setShow(value), []);

    const onValueChange = useCallback(
        (event: any, newDate: any) => {
            const selectedDate = newDate || date;
            showPicker(false);
            setDate(selectedDate);
        },
        [date, showPicker],
    );

    const getHistoricos = useCallback(async () => {
        setLoading(true);

        try {
            const response = await serviceapp.get(
                `(WS_HISTORICO_COMPRAS)?token=${user?.token}&dataInicial=${moment(date).format('YYYYMM')}01&dataFinal=${moment(date).format('YYYYMM')}31`,
            );
            const {data} = response.data.resposta;
            setHistoricos(data);
        } catch (err) {
            console.log(err);
            setHistoricos([]);
        } finally {
            setLoading(false);
        }
    }, [user, date]);

    useFocusEffect(
        useCallback(() => {
            getHistoricos();
        }, [getHistoricos]),
    );

    const RenderItem = ({item}: any) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: '/history-itens',
                        params: {dataHistory: JSON.stringify(item)},
                    })
                }
                className="flex-row items-center justify-between my-1 px-2 rounded-xl text-lg leading-6 font-medium bg-white border border-gray-300 shadow-sm shadow-gray-300 py-4"
            >
                <View className="p-2 w-full">
                    <View className="flex-row mb-1">
                        <Text className="w-28 text-base font-medium">
                            Nota fiscal:
                        </Text>
                        <Text className="text-base font-bold">
                            {item.numero}
                        </Text>
                    </View>

                    <View className="flex-row mb-1">
                        <View className="flex-row w-28">
                            <Text className="text-base font-medium">
                                Série:
                            </Text>
                            <Text className="text-base font-bold">
                                {item.serie}
                            </Text>
                        </View>
                        <View className="flex-row">
                            <Text className="text-base font-medium">
                                Filial:
                            </Text>
                            <Text className="text-base font-bold">
                                {item.filial}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between w-full">
                        <Text className="text-base font-medium">
                            Data: {item.data}
                        </Text>
                        <Text className="text-xl font-bold text-solar-blue-secondary">
                            R$ {maskMoney(item.valor)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Histórico de compras"
                subtitle="Selecione o mês para navegar pelo seu histórico de compras"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className="p-4 bg-gray-100 rounded-t-3xl h-full gap-4 flex-1">
                {show && (
                    <MonthPicker
                        onChange={onValueChange}
                        value={date}
                        maximumDate={new Date()}
                        locale="pt"
                        okButton="Ok"
                        cancelButton="Cancelar"
                    />
                )}
                <View className="flex-1 items-center justify-start bg-solar-gray-dark">
                    <View className="flex-col items-center justify-center">
                        <TouchableOpacity
                            onPress={() => showPicker(true)}
                            className="w-48 mb-6 flex-row items-center justify-between bg-gray-200 border-2 border-white rounded-lg py-2 pl-2 shadow-md shadow-gray-400"
                        >
                            <Text className="flex-1 text-lg text-center text-solar-blue-secondary font-medium">
                                {moment(date).format('MM/YYYY')}
                            </Text>
                            <MaterialCommunityIcons
                                name="calendar-month"
                                size={32}
                                color="#F99F1E"
                            />
                        </TouchableOpacity>

                        {historicos.length === 0 && (
                            <>
                                <Text className="text-base text-solar-blue-secondary font-medium mb-4 px-8 text-center">
                                    Você não possui nenhum histórico de compras
                                    no momento
                                </Text>
                                <Image
                                    source={require('@/assets/images/girl_background.png')}
                                />
                            </>
                        )}
                    </View>

                    <View className="flex-1 w-full">
                        <FlashList
                            data={historicos}
                            renderItem={({item}: any) => (
                                <RenderItem item={item} />
                            )}
                            keyExtractor={(item: any) => item.numero}
                            keyboardShouldPersistTaps={'always'}
                            showsVerticalScrollIndicator={false}
                            onRefresh={getHistoricos}
                            refreshing={loading}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default History;
