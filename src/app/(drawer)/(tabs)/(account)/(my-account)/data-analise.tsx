import {Button} from '@/components/Button';
import ScreenHeader from '@/components/ScreenHeader';
import {router} from 'expo-router';
import React from 'react';
import {Image, Text, View} from 'react-native';

const DataAnalise = () => {
    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Remoção de dados"
                subtitle="Nossa equipe proceguirá com o processo para a exclusão de dados"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className="flex-1 bg-white p-4 rounded-t-3xl">
                <Image
                    className="self-center w-72 h-52"
                    source={require('@/assets/images/new_password_logo.png')}
                />
                <Text className="text-lg text-gray-500 font-medium mt-6 text-center">
                    Aguarde nosso e-mail ou ligação para prosseguir com o
                    processo de exclusão de dados.
                </Text>
            </View>
            <View className="p-4 bg-white">
                <Button
                    onPress={() => router.push('/my-account')}
                    label={'Continuar'}
                    variant={'secondary'}
                    size={'lg'}
                />
            </View>
        </View>
    );
};

export default DataAnalise;
