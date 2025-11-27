import AppDateTimePicker from '@/components/AppDateTimePicker';
import { Button } from '@/components/Button';
import ScreenHeader from '@/components/ScreenHeader';
import { useAuthContext } from '@/contexts/AppContext';
import { maskMoney } from '@/lib/mask';
import serviceapp from '@/services/serviceapp';
import { FlashList } from '@shopify/flash-list';
import { router, useFocusEffect } from 'expo-router';
import { X } from 'lucide-react-native';
import moment from 'moment';
import React, { use, useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';

const Cashback = () => {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [historicoCashback, setHisoricoCashback] = useState<any>([]);
    const [itemsModal, setItemsModal] = useState<any>([]);
    const [itensNota, setItensNota] = useState<any>([]);

    let dataAtual = new Date();
    let dataAnterior = new Date(
        dataAtual.getFullYear(),
        dataAtual.getMonth() - 6,
        dataAtual.getDate(),
    );
    const [dateIni, setDateIni] = useState(dataAnterior);
    const [dateFin, setDateFin] = useState(dataAtual);

    const modalizeRef = useRef<Modalize>(null);

    const onOpen = () => {
        modalizeRef.current?.open();
    };

    const onClose = () => {
        modalizeRef.current?.close();
    };

    const getHistoricoCashback = async () => {
        setLoading(true);
        await serviceapp
            .post('(WS_CONSULTA_CASHBACK)', {
                codcli: user?.codigoCliente,
                dataInicial: moment(dateIni).format('YYYYMMDD'),
                dataFinal: moment(dateFin).format('YYYYMMDD'),
            })
            .then(response => {
                setHisoricoCashback(response?.data?.respcash);
            })
            .catch(error => {
                console.log('error', error);
            })
            .finally(() => setLoading(false));
    };

    useFocusEffect(
        useCallback(() => {
            getHistoricoCashback();
        }, []),
    );

    // console.log('historicoCashback', historicoCashback);
    const handleHistoricoCachback = () => {
        setDateIni(dataAnterior);
        setDateFin(new Date());
        router.push({
            pathname: '/history-cashback',
            params: historicoCashback,
        });
    };

    useEffect(() => {
        const getItensNota = async () => {
            setLoading(true);
            await serviceapp
                .post('(WS_CONSULTA_NF_CASHBACK)', {
                    orige: itemsModal.orige,
                    serie: itemsModal.serie,
                    numnf: itemsModal.numnf,
                })
                .then(response => {
                    setItensNota(response.data.respnfcash.data);
                })
                .catch(error => {
                    console.log('error', error);
                })
                .finally(() => setLoading(false));
        };
        getItensNota();
    }, [itemsModal]);

    const renderItem = ({ item }: any) => (
        <>
            {item.debcre === 'C' && (
                <TouchableOpacity
                    onPress={() => {
                        onOpen();
                        setItemsModal(item);
                    }}
                    className="flex-1 m-1 rounded-lg py-0.5 px-2 my-1 z-[1000] border border-solar-green-primary bg-white"
                    style={{ maxWidth: '100%' }}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="bg-solar-green-primary w-5 h-5 rounded-full" />
                        <Text className="text-gray-600 border-r border-white/20 pr-1.5 py-3">
                            Sér: {item.serie}
                        </Text>
                        <Text className="text-gray-600 border-r border-white/20 pr-1.5 py-3">
                            NF: {item.numnf}
                        </Text>
                        <Text className="text-gray-600 border-r border-white/20 pr-1.5 py-3">
                            Orig: {item.orige}
                        </Text>
                        <Text className="text-gray-600">
                            Val: {maskMoney(item.valor.toFixed(2))}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
            {item.debcre === 'D' && (
                <View
                    className="flex-1 m-1 rounded-lg py-0.5 px-2 my-1 border border-solar-red-primary bg-white"
                    style={{ maxWidth: '100%' }}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="bg-solar-red-primary w-5 h-5 rounded-full" />
                        <Text className="text-gray-600 border-r border-white/20 pr-1.5 py-3">
                            Sér: {item.serie}
                        </Text>
                        <Text className="text-gray-600 border-r border-white/20 pr-1.5 py-3">
                            NF: {item.numnf}
                        </Text>
                        <Text className="text-gray-600 border-r border-white/20 pr-1.5 py-3">
                            Orig: {item.orige}
                        </Text>
                        <Text className="text-gray-600">
                            Val: {maskMoney(item.valor.toFixed(2))}
                        </Text>
                    </View>
                </View>
            )}
        </>
    );

    const RenderItemsNota = ({ item }: any) => (
        <View className="flex-col bg-solar-blue-primary rounded-md p-2 my-1 mx-4">
            <View className="flex-row items-center justify-between mb-1 border-b border-white/20 pb-1">
                <Text className="flex-1 text-sm font-semibold text-white border-r border-white/20 pr-1.5">
                    Item: {item.item}
                </Text>
                <Text className="px-2 text-sm font-semibold text-white">
                    Valor: {maskMoney(`${item.valor}}`)}
                </Text>
            </View>
            <Text className="text-sm font-semibold text-white">
                Descrição: {item.desite}
            </Text>
        </View>
    );

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Histórico de cashback"
                subtitle="Selecione um intervalo de datas para visualizar o histórico de cashback"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center px-8"
            />
            <View className="p-4 bg-gray-100 rounded-t-3xl flex-1 gap-4">
                <View className="flex-col gap-4">
                    <View className="p-4 bg-white rounded-lg flex-row items-center justify-center shadow shadow-black ">
                        <Text className="text-xl font-bold text-gray-600">
                            Saldo:{' '}
                            <Text className="text-solar-orange-secondary text-2xl">
                                R${' '}
                                {historicoCashback?.credTotal &&
                                    maskMoney(
                                        String(
                                            (historicoCashback?.credTotal).toFixed(
                                                2,
                                            ),
                                        ),
                                    )}
                            </Text>
                        </Text>
                    </View>

                    <View className="flex-row justify-between">
                        <View className="items-center gap-2">
                            {/* <Text className='text-lg font-semibold text-gray-600'>Data Inicial</Text> */}
                            <AppDateTimePicker
                                value={dateIni}
                                onChange={setDateIni}
                            />
                        </View>
                        <View className="items-center gap-2">
                            {/* <Text className='text-lg font-semibold text-gray-600'>Data Final</Text> */}
                            <AppDateTimePicker
                                value={dateFin}
                                onChange={setDateFin}
                            />
                        </View>
                    </View>

                    <View className="flex-row items-center justify-start h-10 gap-5 pr-1">
                        <View className="flex-row gap-2">
                            <View className="bg-solar-green-primary w-5 h-5 rounded-full" />
                            <Text>Disponivel</Text>
                        </View>
                        <View className="flex-row gap-2">
                            <View className="bg-solar-red-primary w-5 h-5 rounded-full" />
                            <Text>Usado</Text>
                        </View>
                    </View>
                </View>

                <View className="flex-1">
                    <FlashList
                        data={historicoCashback?.data}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        keyboardShouldPersistTaps={'always'}
                        showsVerticalScrollIndicator={false}
                        onRefresh={getHistoricoCashback}
                        refreshing={loading}
                    />
                </View>

                <View>
                    <Button
                        size={'default'}
                        variant={'secondary'}
                        label={'Solicitar Cashback'}
                        onPress={() => handleHistoricoCachback()}
                        disabled={
                            historicoCashback?.data?.length > 0 ? false : true
                        }
                    />
                </View>
            </View>

            <Modalize
                modalHeight={Dimensions.get('window').height - 150}
                modalTopOffset={80}
                ref={modalizeRef}
                HeaderComponent={
                    <View className="flex-col items-center justify-between mb-4 border-b border-gray-300 py-4">

                        <Text className="text-2xl text-solar-blue-secondary py-4">
                            Itens da nota fiscal
                        </Text>
                        <View className=" bg-solar-blue-primary flex-row items-center justify-center rounded-lg px-4 py-2 shadow-sm shadow-slate-950">
                            <View
                                className={`flex items-center justify-center`}
                            >
                                <Text
                                    className={`text-2xl font-semibold text-white`}
                                >
                                    {itemsModal?.numnf}
                                </Text>
                            </View>
                        </View>
                    </View>
                }
                FooterComponent={
                    <View className='flex-row justify-center p-2'>
                        <Button
                            variant={'secondary'}
                            label={<X size={25} color={'white'} />}
                            onPress={() => modalizeRef.current?.close()}
                            className="bg-solar-red-primary items-center justify-center rounded-full w-14 h-14"
                        />
                    </View>
                }
                flatListProps={{
                    data: itensNota,
                    keyExtractor: (item: any, index: any) => `${item}-${index}`,
                    renderItem: ({ item, index }: { item: any; index: number }) => (
                        <RenderItemsNota item={item} index={index} />
                    ),
                    keyboardShouldPersistTaps: 'handled',
                    showsVerticalScrollIndicator: false,
                }}
            />
        </View>
    );
};

export default Cashback;
