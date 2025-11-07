import {Button} from '@/components/Button';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useState} from 'react';
import {View, Text, Image} from 'react-native';

const Registered = () => {
    const params = useLocalSearchParams();
    return (
        <View className="bg-solar-blue-primary flex-1">
            <View className="p-4 bg-gray-100 rounded-t-3xl h-full">
                <View className="flex-row items-center justify-center my-8">
                    <Image
                        className="self-center"
                        source={require('@/assets/images/need_password_logo.png')}
                    />
                </View>
                <View className="flex-col justify-between flex-1">
                    <View className="gap-8">
                        <View>
                            <Text className="text-3xl font-semibold text-center text-solar-blue-secondary">
                                Cadastro efetuado com sucesso
                            </Text>
                        </View>
                        <Text className="text-xl px-10 text-center text-gray-600">
                            Agora só falta criar uma senha para obter acesso a
                            todas as facilidades do aplicativo.
                        </Text>
                    </View>
                    <View>
                        <Button
                            onPress={() =>
                                router.replace({
                                    pathname: '/check-password',
                                    params: {
                                        cpfcnpj: params?.cpfcnpj,
                                    },
                                })
                            }
                            labelClasses="text-xl font-medium"
                            label="Criar senha"
                            variant="secondary"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Registered;
