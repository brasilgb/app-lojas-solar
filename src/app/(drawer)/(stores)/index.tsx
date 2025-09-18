import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import ScreenHeader from '@/components/ScreenHeader'
import { MapPinIcon } from 'lucide-react-native'
import { Button } from '@/components/Button'
import { useAuthContext } from '@/contexts/AppContext'
import serviceapp from '@/services/serviceapp'
import { useIsFocused } from '@react-navigation/native'
import { router, useLocalSearchParams } from 'expo-router'

const SolarStores = () => {
  const params = useLocalSearchParams();
  const { positionGlobal, currentCity } = useAuthContext();
  const [location, setLocation] = useState<[any, any]>([0, 0]);
  const [locationLojasProxima, setLocationLojasProxima] = useState<any>([]);
  const [citiesStore, setCitiesStore] = useState<any>([]);
  const isFocused = useIsFocused();
  const mapRef = useRef<any>(0);
  const paramdata: any = params?.data;

  useEffect(() => {
    async function getLocationLojasProxima() {
      let lojas = paramdata ? 'WS_CARREGA_LOJAS' : 'WS_LOJAS_PROXIMA';
      let latitudel = parseFloat(positionGlobal[0]);
      let longitudel = parseFloat(positionGlobal[1]);
      await serviceapp
        .get(`(${lojas})?latitude=${latitudel}&longitude=${longitudel}`)
        .then(response => {
          if (paramdata) {
            let result = response.data.resposta.data.filter(
              (l: any) =>
                l.cidade.split('-')[0] === paramdata.split('-')[0] &&
                l.latitude !== '' &&
                l.longitude !== '',
            );
            setLocationLojasProxima(result);
            const { latitude, longitude } = result[0];
            setTimeout(() => {
              const setregion = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                latitudeDelta: 0.0043,
                longitudeDelta: 0.0034,
              };
              if (mapRef.current) {
                mapRef.current.animateToRegion(setregion, 300);
              }
            }, 1000);
          } else {
            setLocationLojasProxima(response.data.resposta.data);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    if (isFocused) {
      getLocationLojasProxima();
    }
  }, [location, paramdata]);

  const renderStore = ({ item, index }: any) => (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => router.push('/store-selected', { dataStore: item } as any)}
    >
      <View
        key={index}
        className={` ${Platform.OS == 'ios'
          ? 'shadow-sm shadow-gray-300'
          : 'shadow-sm shadow-black'
          } bg-solar-gray-middle m-2 border border-white rounded-lg`}
      >
        <View className="p-4">
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            className="text-base text-solar-blue-dark font-Poppins_700Bold pb-1.5"
          >
            {item.cidade}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            className="text-xs text-gray-500 font-Poppins_400Regular pb-1.5"
          >
            {item.endereco}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            className="text-xs text-gray-500 font-Poppins_400Regular pb-1.5"
          >
            {item.email}
          </Text>
        </View>
        <View className="flex-row items-center justify-between bg-solar-gray-dark px-2 pt-2 border-t border-white">
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            className="text-base text-solar-blue-dark font-Poppins_500Medium pb-1.5"
          >
            {item.whats}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            className="text-base text-solar-yellow-dark font-Poppins_500Medium pb-1.5"
          >
            {item.distancia}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
            <Text className='text-sm font-RobotoMedium text-gray-700'>{currentCity.toUpperCase()}</Text>
          </View>
          <View>
            <Button label={'Alterar'} variant={'default'} size={'sm'} />
          </View>
        </View>

        <View className='flex-1 border-t-4 border-solar-green-primary items-center justify-center'>

          <Text>{positionGlobal}</Text>

        </View>
        <View className="absolute bottom-16">
          <Carousel
            layout={'default'}
            vertical={false}
            layoutCardOffset={9}
            data={locationLojasProxima}
            renderItem={renderItem}
            sliderWidth={SLIDER_WIDTH}
            itemWidth={ITEM_WIDTH}
            inactiveSlideShift={0}
            useScrollView={true}
            onSnapToItem={index => onCaroucelItemChange(index)}
            autoplay={false}
            inactiveSlideScale={1}
            inactiveSlideOpacity={1}
            callbackOffsetMargin={5}
          />
        </View>
      </View>
    </View>
  )
}

export default SolarStores