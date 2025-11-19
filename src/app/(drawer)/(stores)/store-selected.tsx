import {useAuthContext} from '@/contexts/AppContext';
import {useLocalSearchParams} from 'expo-router';
import {PhoneCall, RouteIcon} from 'lucide-react-native';
import React, {useRef, useState} from 'react';

import {
    Alert,
    Image,
    Linking,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Map, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

export default function StoreSelected() {
    const {positionGlobal} = useAuthContext();
    const params = useLocalSearchParams();
    const dataStore = params as any;

    // Maps animation
    const mapRef = useRef<any>(0);

    const [region, setRegion] = useState({
        latitude: parseFloat(dataStore?.latitude),
        longitude: parseFloat(dataStore?.longitude),
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0034,
    });

    const handleMapDirection = () => {
        Alert.alert(
            'Atenção',
            'O mapa será aberto no navegador',
            [
                {
                    text: 'Sim',
                    onPress: () =>
                        Linking.openURL(
                            `https://www.google.com/maps/dir/?api=1&layer=transit&origin=${positionGlobal[0]},${positionGlobal[1]}&destination=${dataStore?.latitude},${dataStore?.longitude}&dir_action=replace`,
                        ),
                },
                {
                    text: 'Não',
                    style: 'cancel',
                },
            ],
            {cancelable: false},
        );
    };

    return (
        <View
            className="flex-1 border-y-4 border-solar-green-primary items-center justify-center"
            style={{flex: 1}}
        >
            <View className="h-2/4 w-full border-b-4 border-solar-green-primary">
                <Map
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    showsUserLocation
                    loadingEnabled
                    style={{flex: 1}}
                >
                    <Marker
                        coordinate={{
                            latitude: parseFloat(dataStore.latitude),
                            longitude: parseFloat(dataStore.longitude),
                        }}
                    >
                        <Image
                            source={require('@/assets/images/map_marker.png')}
                            className="w-10 h-10"
                            resizeMode="cover"
                        />
                    </Marker>
                </Map>
            </View>

            <View className="px-2 py-4 w-full">
                <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-roboto text-solar-blue-dark ml-2">
                        {dataStore?.cidade}
                    </Text>
                    <Text className="text-lg font-roboto text-solar-yellow-dark ml-2">
                        {dataStore?.distancia}
                    </Text>
                </View>
                <Text className="text-lg font-roboto text-gray-600 ml-2">
                    {dataStore?.endereco}
                </Text>
                <Text className="text-lg font-roboto text-gray-600 ml-2">
                    {dataStore?.email}
                </Text>
                <Text className="text-lg font-roboto text-solar-blue-dark ml-2">
                    {dataStore?.whats}
                </Text>
            </View>

            <View className="flex-1 px-4 w-full">
                <View className="border-t border-gray-400 py-8 px-2">
                    <TouchableOpacity
                        className="flex-row items-center justify-start "
                        onPress={handleMapDirection}
                    >
                        <RouteIcon color="#0d3b85" size={30} />
                        <Text className="text-lg font-roboto text-solar-blue-dark ml-2">
                            Traçar rota
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View
                className={`w-full flex-row items-center justify-between bg-solar-orange-primary px-4 ${Platform.OS === 'ios' ? 'pt-4 pb-14' : 'py-4'}`}
            >
                <View>
                    <Text className="text-lg font-roboto text-white">
                        Ligar para a loja
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${dataStore?.whats}`)}
                >
                    <PhoneCall color={'white'} size={26} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
