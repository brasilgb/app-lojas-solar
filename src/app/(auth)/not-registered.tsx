import {Button} from '@/components/Button';
import {router, useLocalSearchParams} from 'expo-router';
import React from 'react';
import {Image, Text, View} from 'react-native';

const NotRegistered = () => {
    const params = useLocalSearchParams();
    return (
        <View className="bg-solar-blue-primary flex-1">
            <View className="p-4 bg-gray-100 rounded-t-3xl h-full">
                <View className="flex-row items-center justify-center my-8">
                    <Image
                        className="self-center"
                        source={require('@/assets/images/registration.png')}
                    />
                </View>
                <View className="flex-col justify-between flex-1">
                    <View className="gap-8">
                        <View>
                            <Text className="text-3xl font-semibold text-center text-solar-blue-secondary">
                                Você ainda não possui um cadastro nas lojas
                                solar.
                            </Text>
                        </View>
                        <Text className="text-xl px-10 text-center text-gray-600">
                            Você poderá efetuar seu cadastro aqui, e ter em sua
                            mão todas as facilidades através de nosso
                            aplicativo.
                        </Text>
                    </View>
                    <View>
                        <Button
                            onPress={() =>
                                router.push({
                                    pathname: '/register-customer',
                                    params: {
                                        cpfcnpj: params?.cpfcnpj,
                                    },
                                })
                            }
                            labelClasses="text-xl font-medium"
                            label="Quero me cadastrar agora"
                            variant="secondary"
                        />
                        <Button
                            onPress={() => router.push('/')}
                            label="Quero deixar para depois"
                            variant="link"
                            labelClasses="text-sm text-gray-600"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default NotRegistered;
