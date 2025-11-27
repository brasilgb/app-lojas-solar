import {Button} from '@/components/Button';
import {router, useLocalSearchParams} from 'expo-router';
import React from 'react';
import {Image, Text, View} from 'react-native';

const PasswordChanged = () => {
    const params = useLocalSearchParams();
    return (
        <View className="bg-solar-blue-primary flex-1">
            <View className="p-4 bg-gray-100 rounded-t-3xl h-full">
                <View className="flex-row items-center justify-center my-8">
                    <Image
                        className="self-center"
                        source={require('@/assets/images/successful_password_logo.png')}
                    />
                </View>
                <View className="flex-col justify-between flex-1">
                    <View className="gap-8">
                        <View>
                            <Text className="text-3xl font-semibold text-center text-solar-blue-secondary">
                                Senha criada com sucesso!
                            </Text>
                        </View>
                        <Text className="text-xl px-10 text-center text-gray-600">
                            Lembre-se você irá utilizar essa senha sempre que
                            fazer login no aplicativo das Lojas Solar.
                        </Text>
                    </View>
                    <View>
                        <Button
                            onPress={() =>
                                router.push({
                                    pathname: '/register-password',
                                    params: {
                                        cpfcnpj: params?.cpfcnpj,
                                    },
                                })
                            }
                            labelClasses="text-xl font-medium"
                            label="Prosseguir"
                            variant="secondary"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default PasswordChanged;
