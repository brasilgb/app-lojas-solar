import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import ScreenHeader from '@/components/ScreenHeader'
import { Switch } from '@/components/Switch'
import { useAuthContext } from '@/contexts/AppContext'
import serviceapp from '@/services/serviceapp'
import React, { useEffect, useState } from 'react'
import { Alert, Text, View } from 'react-native'


const PrivacySettings = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { user, disconnect } = useAuthContext();
  const [isNotification, setIsNotification] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [autorizaCliente, setAutorizaCliente] = useState<any>([]);

  const toggleNotify = () => {
    setIsNotification(previousState => !previousState);
  };
  const toggleEmail = () => {
    setIsEmail(previousState => !previousState);
  };

  useEffect(() => {
    const getAutorizaCliente = async () => {
      setLoading(true);
      await serviceapp
        .get(`(WS_AUTORIZA_CLIENTE)?token=${user?.token}`)
        .then(response => {
          const { token, message, data } = response.data.resposta;
          setLoading(false);
          
          setAutorizaCliente(data?.pergunta);
          setIsNotification(
            data?.pergunta[0]?.resposta === 'S' ? true : false,
          );
          setIsEmail(
            data?.pergunta[1]?.resposta === 'S' ? true : false,
          );
        })
        .catch(err => {
          console.log(err);
        });
    };
    getAutorizaCliente();
  }, [user]);

  const handleSubmitPrivacity = async () => {
    setLoading(true);
    const response = await serviceapp.get(
      `(WS_RESPOSTA_AUTORIZA)?
      token=${user?.token}&
      resposta1=${isNotification ? 'S' : 'N'}
      &resposta2=${isEmail ? 'S' : 'N'}`,
    );
    const { success, message } = response.data.resposta;
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

    Alert.alert('Atenção', 'Atualização de dados concluída com sucesso', [
      { text: 'Ok' },
    ]);
  };

  return (
    <View className='bg-solar-blue-primary flex-1'>
      <ScreenHeader
        title="Privacidade"
        subtitle="Suas configurações de privacidade podem ser alteradas abaixo"
        classTitle='text-white text-2xl'
        classSubtitle='text-white text-base text-center'
      />
      <View className='p-4 bg-gray-100 rounded-t-3xl h-full gap-4'>
        <Card className='w-full flex-row items-center justify-between  border-gray-200 bg-white' style={{ elevation: 2 }}>
          <View className='p-4 w-4/5'>
            <Text className='text-xl font-medium text-solar-blue-secondary'>{autorizaCliente && autorizaCliente[0]?.texto}</Text>
          </View>
          <View>
            <Switch
              onValueChange={toggleNotify}
              value={isNotification}
            />
          </View>
        </Card>
        <Card className='w-full flex-row items-center justify-between  border-gray-200 bg-white' style={{ elevation: 2 }}>
          <View className='p-4 w-4/5'>
            <Text className='text-xl font-medium text-solar-blue-secondary'>{autorizaCliente && autorizaCliente[1]?.texto}</Text>
          </View>
          <View>
            <Switch
              onValueChange={toggleEmail}
              value={isEmail}
            />
          </View>
        </Card>
        <View className='mt-24'>
          <Button
            label={'Concluir'}
            variant={'default'}
            onPress={handleSubmitPrivacity}
          />
        </View>
      </View>
    </View>
  )
}

export default PrivacySettings