import AppLoading from '@/components/app-loading';
import { Button } from '@/components/Button';
import ScreenHeader from '@/components/ScreenHeader';
import StoreListModal from '@/components/StoreListModal';
import { useAuthContext } from '@/contexts/AppContext';
import serviceapp from '@/services/serviceapp';
import { router, useFocusEffect } from 'expo-router';
import { MapPinHouseIcon, MapPinIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Map, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Carousel from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get('window');
export const HEIGHT = Dimensions.get('window').height;
export const SLIDER_WIDTH = Dimensions.get('window').width;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.8);
const CARD_WIDTH = width * 0.8;

const SolarStores = () => {
    const { positionGlobal, setStoreList } = useAuthContext();
    const [location, setLocation] = useState<[any, any]>([0, 0]);
    const [locationLojasProxima, setLocationLojasProxima] = useState<any>([]);
    const [citiesStore, setCitiesStore] = useState<any>([]);

    const [loading, setLoading] = useState<boolean>(false);
    // Estado para guardar a cidade que foi selecionada
    const [selectedCity, setSelectedCity] = useState<any>(null);
    const modalizeRef = useRef<any>(null);

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


    useFocusEffect(
        useCallback(() => {
            async function getLocationLojasProxima() {
                let lojas = selectedCity
                    ? 'WS_CARREGA_LOJAS'
                    : 'WS_LOJAS_PROXIMA';
                let latitudel = parseFloat(positionGlobal[0]);
                let longitudel = parseFloat(positionGlobal[1]);
                await serviceapp
                    .get(
                        `(${lojas})?latitude=${latitudel}&longitude=${longitudel}`,
                    )
                    .then(response => {
                        if (selectedCity) {
                            let result = response.data.resposta.data.filter(
                                (l: any) =>
                                    l.cidade.split('-')[0] ===
                                    selectedCity?.cidade?.split('-')[0] &&
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
                                    mapRef.current.animateToRegion(
                                        setregion,
                                        300,
                                    );
                                }
                            }, 1000);
                        } else {
                            setLocationLojasProxima(
                                response.data.resposta.data,
                            );
                            setStoreList(response.data.resposta.data);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            getLocationLojasProxima();
        }, [selectedCity])
    );

    useFocusEffect(
        useCallback(() => {
            async function getLocationLojas() {
                await serviceapp
                    .get(`(WS_CARREGA_LOJAS)`)
                    .then(response => {
                        const { data, message, token } = response.data.resposta;
                        setCitiesStore(data);

                    })
                    .catch(err => {
                        console.log(err);
                    });
            }

            getLocationLojas();
        }, []),
    );

    const onCaroucelItemChange = (index: number) => {
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
        <View className="flex-1 justify-start items-center">
            <TouchableOpacity
                key={index}
                activeOpacity={1}
                onPress={() =>
                    router.push({
                        pathname: '/store-selected',
                        params: item,
                    })
                }
            >
                <View
                    key={index}
                    style={{ width: ITEM_WIDTH }}
                    className="shadow-sm shadow-gray-800 bg-white border border-gray-100 rounded-lg"
                >
                    <View className="p-4">
                        <Text
                            numberOfLines={1}
                            className="text-base text-solar-blue-secondary font-roboto font-bold"
                        >
                            {item.cidade}
                        </Text>

                        <Text
                            numberOfLines={1}
                            className="text-xs text-gray-500 font-roboto font-medium pb-1.5"
                        >
                            {item.endereco}
                        </Text>

                        <Text
                            numberOfLines={1}
                            className="text-xs text-gray-500 font-roboto font-medium pb-1.5"
                        >
                            {item.email}
                        </Text>
                    </View>

                    <View className="flex-row items-center justify-between bg-gray-100 px-2 pt-2 border-t border-white">
                        <Text
                            numberOfLines={1}
                            className="text-base text-solar-blue-primary font-roboto font-medium pb-1.5"
                        >
                            {item.whats}
                        </Text>
                        <Text
                            numberOfLines={1}
                            className="text-base text-solar-orange-primary font-roboto font-medium pb-1.5"
                        >
                            {item.distancia}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return <AppLoading />;
    }

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Lojas Solar"
                subtitle="Lojas Solar mais Próximas de você"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className="p-0.5 bg-white rounded-t-3xl h-full">
                <View className="bg-solar-blue-primary h-14 rounded-t-3xl p-2 flex-row items-center justify-between gap-4">
                    <View>
                        <MapPinIcon size={30} color={'#FFFFFF'} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-white">
                            Localização
                        </Text>
                        <Text className="text-sm font-medium text-white">
                            {selectedCity?.cidade}
                        </Text>
                    </View>
                    <View className="flex-row gap-2">
                        <Button
                            label={'Alterar'}
                            variant={'secondary'}
                            size={'sm'}
                            onPress={onOpen}
                        />
                        <Button
                            label={
                                <MapPinHouseIcon size={16} color={'white'} />
                            }
                            variant={'destructive'}
                            size={'sm'}
                            onPress={() => router.push('/stores')}
                        />
                    </View>
                </View>

                <View className="flex-1 border-t-4 border-solar-green-primary">
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
                                    <Image
                                        source={require('@/assets/images/map_marker.png')}
                                        className="w-10 h-10"
                                        resizeMode="cover"
                                    />
                                </Marker>
                            );
                        })}
                    </Map>

                    <View className="z-50 absolute bottom-0 h-60 w-full">
                        <Carousel
                            loop={true}
                            width={SLIDER_WIDTH}
                            height={220}
                            snapEnabled={true}
                            autoPlay={false}
                            autoPlayInterval={3000}
                            mode={'parallax'}
                            modeConfig={{
                                parallaxScrollingScale: 0.9,
                                parallaxScrollingOffset: 90,
                            }}
                            data={locationLojasProxima}
                            onSnapToItem={index => onCaroucelItemChange(index)}
                            renderItem={renderStore}
                        />
                    </View>
                </View>
            </View>

            <StoreListModal
                dataModal={citiesStore && citiesStore}
                modalizeRef={modalizeRef} // Função para fechar o modal
                onSelectCity={handleSelectCity}
            />
        </View>
    );
};

export default SolarStores;
