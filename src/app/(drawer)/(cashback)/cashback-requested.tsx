import {View, Text, Image} from 'react-native';
import React from 'react';
import {router, useLocalSearchParams} from 'expo-router';
import {Button} from '@/components/Button';

export default function CashbackRequested() {
    const params = useLocalSearchParams();

    return (
        <View className="flex-1 p-4">
            <View className="flex-1 flex-row items-center justify-center">
                <View className="flex-row items-center justify-center my-8">
                    <Image
                        className="self-center"
                        source={require('@/assets/images/registration.png')}
                    />
                </View>
            </View>
            <View className="flex-1 flex-col items-center">
                <Text className="text-xl font-semibold text-solar-red-primary">
                    Cashback solicitado com sucesso
                </Text>
                <Text className="mt-6 text-lg font-semibold">Pedido</Text>
                <Text className="text-3xl font-bold text-solar-blue-secondary">
                    {params?.numpedido}
                </Text>
                <Text className="text-lg font-semibold text-gray-500 mt-6">
                    Verificar no caixa para a confirmação
                </Text>
            </View>
            <View>
                <Button
                    size={'default'}
                    variant={'secondary'}
                    label={'Contrinuar'}
                    onPress={() => router.replace('/cashback')}
                />
            </View>
        </View>
    );
}
