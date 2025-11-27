import ScreenHeader from '@/components/ScreenHeader';
import {useAuthContext} from '@/contexts/AppContext';
import {FlashList} from '@shopify/flash-list';
import {router} from 'expo-router';
import React from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';

export default function StoreList() {
    const {storeList} = useAuthContext();

    const RenderStore = ({item, index}: any) => (
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
            <View className="shadow-md shadow-gray-800 bg-white m-2 border border-gray-100 rounded-lg">
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
    );

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Lojas Solar"
                subtitle="Lojas Solar mais Próximas de você"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className="p-2 bg-white rounded-t-3xl h-full">
                <FlashList
                    data={storeList}
                    renderItem={({item, index}: any) => (
                        <RenderStore item={item} inded={index} />
                    )}
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}
