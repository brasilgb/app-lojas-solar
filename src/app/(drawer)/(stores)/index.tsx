import React from 'react'
import { View, Text } from 'react-native'
import ScreenHeader from '@/components/ScreenHeader'
import { MapPinIcon } from 'lucide-react-native'
import { Button } from '@/components/Button'

const SolarStores = () => {
  return (
    <View className='bg-solar-blue-primary flex-1'>
      <ScreenHeader title="Lojas Solar" subtitle="Lojas Solar mais Próximas de você" classTitle='text-white text-2xl' classSubtitle='text-white text-lg text-center' />
      <View className='p-0.5 bg-white rounded-t-3xl h-full'>
        <View className='bg-solar-orange-primary h-14 rounded-t-3xl p-2 flex-row items-center justify-between gap-4'>
          <View>
            <MapPinIcon size={30} color={'#4d4e4e'} />
          </View>
          <View className='flex-1'>
            <Text className='text-lg font-RobotoBold text-gray-700'>Localização</Text>
            <Text className='text-sm font-RobotoMedium text-gray-700'>SALVADOR DO SUL</Text>
          </View>
          <View>
            <Button label={'Alterar'} variant={'default'} size={'sm'} />
          </View>
        </View>



      </View>
    </View>
  )
}

export default SolarStores