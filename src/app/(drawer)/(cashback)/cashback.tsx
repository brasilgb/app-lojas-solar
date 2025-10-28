import AppDateTimePicker from '@/components/AppDateTimePicker';
import ScreenHeader from '@/components/ScreenHeader';
import { useAuthContext } from '@/contexts/AppContext';
import { maskMoney } from '@/lib/mask';
import serviceapp from '@/services/serviceapp';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { CircleSmallIcon } from 'lucide-react-native';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Modalize } from 'react-native-modalize';


const Cashback = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [historicoCashback, setHisoricoCashback] = useState<any>([]);
  const [dataInicial, setDataInicial] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [itemsModal, setItemsModal] = useState<any>([]);

  let dataAtual = new Date();
  let dataAnterior = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - 6, dataAtual.getDate());

  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };


  useEffect(() => {
    const getHistoricoCashback = async () => {
      setLoading(true);
      await serviceapp.post('(WS_CONSULTA_CASHBACK)', {
        "codcli": user?.codigoCliente,
        "dataInicial": moment(dataInicial).format("YYYYMMDD"),
        "dataFinal": moment(dataFinal).format("YYYYMMDD")
      })
        .then((response) => {
          setHisoricoCashback(response?.data?.respcash);
        })
        .catch((error) => {
          console.log('error', error);
        })
        .finally(() => setLoading(false));
    };
    getHistoricoCashback();
  }, [user, dataInicial, dataFinal]);

  const handleHistoricoCachback = () => {
    setDataInicial(dataAnterior);
    setDataFinal(new Date())
    router.push({
      pathname: '/historico-cashback',
      params: { cred: historicoCashback }
    })
    // navigation.navigate('HistoricoCashback', { cred: historicoCashback })
  }

  const renderItem = ({ item }: any) => (
    <>
      {item.debcre === 'C' &&
        <TouchableOpacity
          onPress={() => { onOpen(); setItemsModal(item) }}
          className='flex-1 m-1 rounded-md bg-solar-blue-light py-0.5 px-2 my-1 z-[1000]'
          style={{ maxWidth: '100%' }}
        >
          <View className='flex-row items-center justify-between'>
            <Ionicons name='document-text-outline' size={24} color='white' />
            <Text className='text-white border-r border-white/20 pr-1.5 py-3'>Sér: {item.serie}</Text>
            <Text className='text-white border-r border-white/20 pr-1.5 py-3'>NF: {item.numnf}</Text>
            <Text className='text-white border-r border-white/20 pr-1.5 py-3'>Orig: {item.orige}</Text>
            <Text className='text-white'>Val: {maskMoney((item.valor).toFixed(2))}</Text>
          </View>
        </TouchableOpacity>
      }
      {item.debcre === 'D' &&
        <View
          className='flex-1 m-1 rounded-md bg-solar-orange-middle/80 py-0.5 px-2 my-1'
          style={{ maxWidth: '100%' }}
        >
          <View className='flex-row items-center justify-between'>
            <Ionicons name='document-outline' size={24} color='#4b5563' />
            <Text className='text-gray-600 border-r border-white/20 pr-1.5 py-3'>Sér: {item.serie}</Text>
            <Text className='text-gray-600 border-r border-white/20 pr-1.5 py-3'>NF: {item.numnf}</Text>
            <Text className='text-gray-600 border-r border-white/20 pr-1.5 py-3'>Orig: {item.orige}</Text>
            <Text className='text-gray-600'>Val: {maskMoney((item.valor).toFixed(2))}</Text>
          </View>
        </View>
      }
    </>
  );

  return (
    <View className='bg-solar-blue-primary flex-1'>
      <ScreenHeader
        title="Histórico de cashback"
        subtitle="Selecione um intervalo de datas para visualizar o histórico de cashback"
        classTitle='text-white text-2xl'
        classSubtitle='text-white text-base text-center px-8'
      />
      <View className='p-4 bg-gray-100 rounded-t-3xl h-full gap-4'>
        <View className='p-4 bg-white rounded-lg flex-row items-center justify-center shadow shadow-black '>
          <Text className='text-xl font-bold text-gray-600'>Saldo disponível: <Text className='text-solar-orange-secondary text-2xl'>R$ 0,00</Text></Text>
        </View>

        <View className='flex-row justify-between'>
          <View className='items-center gap-2'>
            {/* <Text className='text-lg font-semibold text-gray-600'>Data Inicial</Text> */}
            <AppDateTimePicker value={dataInicial} onChange={setDataInicial} />
          </View>
          <View className='items-center gap-2'>
            {/* <Text className='text-lg font-semibold text-gray-600'>Data Final</Text> */}
            <AppDateTimePicker value={dataFinal} onChange={setDataFinal} />
          </View>
        </View>

        <View className='flex-row items-center justify-start h-10 gap-4'>
          <View className='flex-row gap-2'><View className='bg-solar-green-primary w-5 h-5 rounded-full' /><Text>Disponivel</Text></View>
          <View className='flex-row gap-2'><View className='bg-solar-red-primary w-5 h-5 rounded-full' /><Text>Usado</Text></View>
        </View>

        <View>
          <FlashList
            data={historicoCashback?.data}
            renderItem={renderItem}
            estimatedItemSize={100}
            numColumns={1}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>
    </View>
  )
}

export default Cashback