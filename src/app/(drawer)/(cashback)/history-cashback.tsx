import {Button} from '@/components/Button';
import ScreenHeader from '@/components/ScreenHeader';
import {useAuthContext} from '@/contexts/AppContext';
import {maskMoney} from '@/lib/mask';
import serviceapp from '@/services/serviceapp';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {FlashList} from '@shopify/flash-list';
import {router, useLocalSearchParams} from 'expo-router';
import {CalendarDaysIcon} from 'lucide-react-native';
import moment from 'moment';
import {useCallback, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import MonthPicker from 'react-native-month-year-picker';

const HistoryCashback = () => {
    const {user} = useAuthContext();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeOrder, setActiveOrder] = useState<any>(null);
    const [cashbackSolicitado, setCashbackSolicitado] = useState<any>([]);
    const [applyCashback, setApplyCashback] = useState<any>(0);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const showPicker = useCallback((value: any) => setShow(value), []);
    const [pdvCustomer, setPdvCustomer] = useState<any>([]);

    useEffect(() => {
        const getPdvCustomer = async () => {
            setLoading(true);
            setActiveOrder(null);
            await serviceapp
                .post('(LISTA_PDV_CASHBACK)', {
                    codcli: parseInt(user?.codigoCliente),
                    meschave: parseInt(moment(date).format('M')),
                    anochave: parseInt(moment(date).format('YYYY')),
                })
                .then(response => {
                    setPdvCustomer(response.data.resposta.dados);
                })
                .catch(error => {
                    console.log('error', error);
                })
                .finally(() => setLoading(false));
        };
        getPdvCustomer();
    }, [user, date]);

    const onValueChange = useCallback(
        (event: any, newDate: any) => {
            const selectedDate = newDate || date;
            showPicker(false);
            setDate(selectedDate);
        },
        [date, showPicker],
    );

    const handleSelectCachback = (id: any, item: any) => {
        setActiveOrder(id);
        setCashbackSolicitado(item);

        let maxCashbach: number = ((item?.total * Number(params?.porcent)) /
            100) as number;
        const aapplyCashback =
            Number(params?.credTotal) >= Number(maxCashbach)
                ? maxCashbach
                : params?.credTotal;
        setApplyCashback(aapplyCashback);
    };

    const handleCashbackRequest = async () => {
        await serviceapp
            .post('(WS_GRAVA_CASHBACK)', {
                datped: moment(`${cashbackSolicitado.dtpedido}`).format(
                    'YYYYMMDD',
                ),
                filped: cashbackSolicitado.filial,
                numped: cashbackSolicitado.numpedido,
                codcli: user?.codigoCliente,
                vlrcash: applyCashback,
            })
            .then(response => {
                setDate(new Date());
                router.push({
                    pathname: '/cashback-requested',
                    params: cashbackSolicitado,
                });
            })
            .catch(error => {
                console.log('error', error);
            });
    };

    const renderItem = ({item, index}: any) => (
        <>
            {!item.pixgerado ? (
                <TouchableOpacity
                    onPress={() => handleSelectCachback(index, item)}
                    className={`border border-gray-50 rounded p-1 my-2 ${activeOrder == index ? 'bg-solar-green-primary' : 'bg-solar-blue-primary'}`}
                >
                    {activeOrder == index && (
                        <Text className="absolute z-50 -top-0.5 right-0 text-solar-green-primary">
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={26}
                            />
                        </Text>
                    )}
                    <View className="bg-solar-blue-primary rounded-md p-1">
                        <View className="flex-row items-center justify-between pb-1">
                            <Text className="w-[25%] text-white">
                                Data pedido
                            </Text>
                            <Text className="w-[10%] text-white">Filial</Text>
                            <Text className="w-[20%] text-white">
                                N° Pedido
                            </Text>
                            <Text className="w-[30%] text-white">Valor</Text>
                        </View>
                        <View className="flex-row items-center justify-between bg-gray-50 p-1 rounded">
                            <Text className="w-[25%]">
                                {moment(`${item.dtpedido}`).format(
                                    'DD/MM/YYYY',
                                )}
                            </Text>
                            <Text className="w-[10%]">{item.filial}</Text>
                            <Text className="w-[20%]">{item.numpedido}</Text>
                            <Text className="w-[30%]">
                                R$ {maskMoney(item.total.toFixed(2))}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ) : (
                <View
                    className={`border border-gray-50 rounded p-1 my-2 ${activeOrder == index ? 'bg-solar-green-light' : 'bg-solar-blue-primary/50'}`}
                >
                    {activeOrder == index && (
                        <Text className="absolute z-50 -top-0.5 right-0 text-solar-green-primary">
                            <MaterialCommunityIcons
                                name="check-circle"
                                size={26}
                            />
                        </Text>
                    )}
                    <View className="bg-solar-blue-primary/50 rounded-md p-1">
                        <View className="flex-row items-center justify-between pb-1">
                            <Text className="w-[25%] text-white">
                                Data pedido
                            </Text>
                            <Text className="w-[10%] text-white">Filial</Text>
                            <Text className="w-[20%] text-white">
                                N° Pedido
                            </Text>
                            <Text className="w-[30%] text-white">Valor</Text>
                        </View>
                        <View className="flex-row items-center justify-between bg-gray-50 p-1 rounded">
                            <Text className="w-[25%]">
                                {moment(`${item.dtpedido}`).format(
                                    'DD/MM/YYYY',
                                )}
                            </Text>
                            <Text className="w-[10%]">{item.filial}</Text>
                            <Text className="w-[20%]">{item.numpedido}</Text>
                            <Text className="w-[30%]">
                                R$ {maskMoney(item.total.toFixed(2))}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </>
    );

    const PdvList = () => {
        return <FlashList data={pdvCustomer} renderItem={renderItem} />;
    };

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Cashback"
                subtitle="Histórico de pedidos para solicitação de cashback"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className="flex-1 p-4 bg-gray-100 rounded-t-3xl h-full gap-4">
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

                <View className="px-2 flex-1">
                    <View className="flex-1 py-4 w-full">
                        <View className="flex-row items-center justify-center mb-4">
                            <View className="flex-row items-center gap-4 p-2 bg-white rounded-lg shadow shadow-black">
                                <Text className="text-lg text-solar-blue-secondary">
                                    {moment(date).format('MM/YYYY')}
                                </Text>
                                <Button
                                    variant={'default'}
                                    size={'icon'}
                                    onPress={() => showPicker(true)}
                                    label={
                                        <CalendarDaysIcon
                                            size={24}
                                            color={'white'}
                                        />
                                    }
                                    labelClasses="p-0.5"
                                />
                            </View>
                        </View>
                        <View>
                            {pdvCustomer.length > 0 ? (
                                <Text className="text-xs font-semibold">
                                    * Clique em um pedido abaixo para solicitar
                                    cashback. caso não esteja clicável está em
                                    processo de avaliação.
                                </Text>
                            ) : (
                                <Text className="text-xs font-medium text-red-400">
                                    * Não há pedidos para o mês corrente,
                                    selecione outro mês acima.
                                </Text>
                            )}
                        </View>
                        <View className="flex-1 w-full">
                            <PdvList />
                        </View>
                    </View>
                    <View className="my-6">
                        <View className="flex-row items-center justify-end pb-4">
                            <Text
                                className={`text-lg font-medium px-4 ${applyCashback > 0 && activeOrder !== null ? 'text-solar-green-primary' : 'text-solar-red-primary'}`}
                            >
                                Cashback liberado
                            </Text>
                            <Text
                                className={`rounded-full py-2 px-4 font-bold text-xl ${applyCashback > 0 && activeOrder !== null ? 'bg-solar-green-primary' : 'bg-solar-red-primary'} text-white`}
                            >
                                R${' '}
                                {maskMoney(
                                    activeOrder !== null
                                        ? String(applyCashback)
                                        : '0,00',
                                )}
                            </Text>
                        </View>
                    </View>

                    <View>
                        <Button
                            size={'default'}
                            variant={'secondary'}
                            label={'Solicitar Cashback'}
                            onPress={() => handleCashbackRequest()}
                            disabled={activeOrder !== null ? false : true}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};
export default HistoryCashback;
