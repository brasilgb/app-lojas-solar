import { View, Text, Alert, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ScreenHeader from '@/components/ScreenHeader'
import { Modalize } from 'react-native-modalize';
import serviceapp from '@/services/serviceapp';
import { useAuthContext } from '@/contexts/AppContext';
import { FlashList } from '@shopify/flash-list';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { router } from 'expo-router';

const AssistanceProtocol = () => {
  const { user, disconnect } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [protocols, setProtocols] = useState<any>([])
  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const onClose = () => {
    modalizeRef.current?.close();
  };

  useEffect(() => {
    const getProtocols = async () => {
      setLoading(true);
      await serviceapp
        .get(`(WS_PROTOCOLO_ASSISTENCIA)?token=${user?.token}`)
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
          setProtocols(data);
        })
        .catch(err => {
          console.log(err);
        });
    };
    getProtocols();
  }, [user]);

  const RenderProtocols = ({ item, index }: any) => (
    <Pressable
      onPress={() => router.push({
        pathname: '/(drawer)/(assistance)/assistance-detail',
        params: item
      })}
    >
      <Card className="border border-white rounded-lg mb-2 bg-gray-50 p-2 shadow-md shadow-black m-2">
        <CardHeader className='border-b border-gray-300 mb-4'>
          <Text className='text-xl font-bold text-gray-700'>Protocolo {item.nProtocolo}</Text>
        </CardHeader>
        <CardContent className=''>
          <Text>{item.produto}</Text>
        </CardContent>
      </Card>
    </Pressable>
  );

  return (
    <View className='bg-solar-blue-primary flex-1'>
      <ScreenHeader title="Assistência Técnica" subtitle="Aqui consta todos os seu equipamentos que foram enviados para a garantia" classTitle='text-white text-2xl' classSubtitle='text-white text-lg text-center' />
      <View className='p-2 bg-white rounded-t-3xl h-full'>
        <FlashList
          data={protocols}
          renderItem={({ item }: { item: any }) => <RenderProtocols item={item} />}
          keyExtractor={(item: any, index: any) => index}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

export default AssistanceProtocol