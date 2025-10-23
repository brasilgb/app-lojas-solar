import { Card, CardContent, CardHeader } from '@/components/Card';
import ScreenHeader from '@/components/ScreenHeader';
import { useAuthContext } from '@/contexts/AppContext';
import serviceapp from '@/services/serviceapp';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';

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
          const { message, data, token } = response.data.resposta;
          setLoading(false);
          if (!token) {
            Alert.alert('Atenção', message, [
              {
                text: 'Ok',
                onPress: () => {
                  return router.push('/(drawer)');
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
      <ScreenHeader title="Assistência Técnica" subtitle="Aqui consta todos os seu equipamentos que foram enviados para a garantia" classTitle='text-white text-2xl' classSubtitle='text-white text-base text-center' />
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