import AppLoading from '@/components/app-loading'
import { Button } from '@/components/Button'
import ScreenHeader from '@/components/ScreenHeader'
import StoreListModal from '@/components/StoreListModal'
import { useAuthContext } from '@/contexts/AppContext'
import serviceapp from '@/services/serviceapp'
import { router } from 'expo-router'
import { MapPinIcon } from 'lucide-react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Map, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { Modalize } from 'react-native-modalize'
import Carousel from 'react-native-snap-carousel'

const { width, height } = Dimensions.get('window');
export const HEIGHT = Dimensions.get('window').height;
export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
const CARD_WIDTH = width * 0.8;

const SolarStores = () => {
  const { setStoreList } = useAuthContext();
  const { positionGlobal, currentCity } = useAuthContext();
  const [location, setLocation] = useState<[any, any]>([0, 0]);
  const [locationLojasProxima, setLocationLojasProxima] = useState<any>([]);
  const [citiesStore, setCitiesStore] = useState<any>([]);

  const [loading, setLoading] = useState<boolean>(false);
  // Estado para guardar a cidade que foi selecionada
  const [selectedCity, setSelectedCity] = useState(null);
  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  // Função para lidar com a seleção de uma cidade
  const handleSelectCity = (city: any) => {
    setSelectedCity(city); // Atualiza o estado com a cidade selecionada
    modalizeRef.current?.close(); // Fecha o modal automaticamente após a seleção
  };

  // Maps animation
  const mapRef = useRef<any>(0);
  let mapAnimation = new Animated.Value(0);

  const [region, setRegion] = useState({
    latitude: positionGlobal[0],
    longitude: positionGlobal[1],
    latitudeDelta: 0.0043,
    longitudeDelta: 0.0034,
  });

  useEffect(() => {
    async function getLocationLojasProxima() {
      setLoading(true);

      let lojas = selectedCity ? 'WS_CARREGA_LOJAS' : 'WS_LOJAS_PROXIMA';
      let latitudel = parseFloat(positionGlobal[0]);
      let longitudel = parseFloat(positionGlobal[1]);
      await serviceapp
        .get(`(${lojas})?latitude=${latitudel}&longitude=${longitudel}`)
        .then(response => {
          if (selectedCity) {
            let result = response.data.resposta.data.filter(
              (l: any) =>
                l.cidade.split('-')[0] === (selectedCity as any)?.cidade?.split('-')[0] &&
                l.latitude !== '' &&
                l.longitude !== '',
            );
            setLocationLojasProxima(result);
            setStoreList(result);
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
            setStoreList(response.data.resposta.data);
          }
        })
        .catch(err => {
          console.log(err);
        }).finally(() => setLoading(false));
    }
    getLocationLojasProxima();

  }, [location, selectedCity]);


  useEffect(() => {
    async function getLocationLojas() {
      await serviceapp
        .get(`(WS_CARREGA_LOJAS)`)
        .then(response => {
          const { data, message, token } = response.data.resposta.data;
          
          setCitiesStore(data);
        })
        .catch(err => {
          console.log(err);
        });
    }
    getLocationLojas();
  }, []);


  const onCaroucelItemChange = (index: any) => {
    const { latitude, longitude } = locationLojasProxima[index];

    const setregion = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      latitudeDelta: 0.0043,
      longitudeDelta: 0.0034,
    };
    if (mapRef.current) {
      mapRef.current.animateToRegion(setregion, 300);
    }
  };

  const interpolations = locationLojasProxima.map(
    (marker: any, index: any) => {
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH,
      ];

      const scale = mapAnimation.interpolate({
        inputRange,
        outputRange: [1, 1.5, 1],
        extrapolate: 'clamp',
      });

      return { scale };
    },
  );

  const renderStore = ({ item, index }: any) => (
    <TouchableOpacity
      key={index}
      activeOpacity={1}
      onPress={() => router.push({
        pathname: '/store-selected',
        params: item
      })}
    >
      <View
        key={index}
        className={` ${Platform.OS == 'ios'
          ? 'shadow-sm shadow-gray-300'
          : 'shadow-sm shadow-black'
          } bg-white m-2 border border-gray-100 rounded-lg`}
      >
        <View className="p-4">
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            className="text-base text-solar-blue-secondary font-roboto font-bold"
          >
            {item.cidade}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            className="text-xs text-gray-500 font-roboto font-medium pb-1.5"
          >
            {item.endereco}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            className="text-xs text-gray-500 font-roboto font-medium pb-1.5"
          >
            {item.email}
          </Text>
        </View>
        <View className="flex-row items-center justify-between bg-gray-100 px-2 pt-2 border-t border-white">
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            className="text-base text-solar-blue-primary font-roboto font-medium pb-1.5"
          >
            {item.whats}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            className="text-base text-solar-orange-primary font-roboto font-medium pb-1.5"
          >
            {item.distancia}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <AppLoading />
  }

  return (
    <View className='bg-solar-blue-primary flex-1'>
      <ScreenHeader title="Lojas Solar" subtitle="Lojas Solar mais Próximas de você" classTitle='text-white text-2xl' classSubtitle='text-white text-base text-center' />
      <View className='p-0.5 bg-white rounded-t-3xl h-full'>
        <View className='bg-solar-orange-primary h-14 rounded-t-3xl p-2 flex-row items-center justify-between gap-4'>
          <View>
            <MapPinIcon size={30} color={'#4d4e4e'} />
          </View>
          <View className='flex-1'>
            <Text className='text-lg font-RobotoBold text-gray-700'>Localização</Text>
            <Text className='text-sm font-RobotoMedium text-gray-700'>{currentCity?.toUpperCase()}</Text>
          </View>
          <View>
            <Button
              label={'Alterar'}
              variant={'default'}
              size={'sm'}
              onPress={onOpen}
            />
          </View>
        </View>

        <View className='flex-1 border-t-4 border-solar-green-primary items-center justify-center' style={{ flex: 1 }} >
          <Map
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            showsUserLocation
            loadingEnabled
            style={StyleSheet.absoluteFill}
          >
            {locationLojasProxima.map((marker: any, index: any) => {
              const scaleStyle = {
                transform: [
                  {
                    scale: interpolations[index].scale,
                  },
                ],
              };
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: parseFloat(marker.latitude),
                    longitude: parseFloat(marker.longitude),
                  }}
                >
                  <Animated.View className="items-center justify-center w-14 h-14" style={{ elevation: 2 }}>
                    <Animated.Image
                      source={require('@/assets/images/map_marker.png')}
                      style={[scaleStyle]}
                      className="w-5 h-5"
                      resizeMode="cover"

                    />
                  </Animated.View>
                </Marker>
              );
            })}
          </Map>
        </View>

        <View className="absolute bottom-24">
          <Carousel
            key={Math.floor(Math.random() * locationLojasProxima.length)}
            layout={'default'}
            vertical={false}
            layoutCardOffset={9}
            data={locationLojasProxima}
            renderItem={renderStore}
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

      <StoreListModal
        dataModal={citiesStore && citiesStore}
        visible={modalizeRef} // Função para fechar o modal
        onSelectCity={handleSelectCity}
      />
    </View>
  )
}

export default SolarStores