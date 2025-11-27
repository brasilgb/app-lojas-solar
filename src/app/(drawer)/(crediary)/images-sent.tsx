import {View, Text, Image} from 'react-native';
import React from 'react';
import {router} from 'expo-router';
import {Button} from '@/components/Button';

const ImagesSent = () => {
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
                                Obrigado por registrar-se e solicitar o
                                crediário das Lojas Solar
                            </Text>
                        </View>
                        <Text className="text-xl px-10 text-center text-gray-600">
                            Suas informações serão analisadas pela equipe das
                            Lojas Solar e entraremos em contato.
                        </Text>
                    </View>
                    <View>
                        <Button
                            onPress={() =>
                                router.replace('/(drawer)/(crediary)/crediary')
                            }
                            labelClasses="text-xl font-medium"
                            label="Entendi"
                            variant="secondary"
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ImagesSent;
