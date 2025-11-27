import ScreenHeader from '@/components/ScreenHeader';
import React from 'react';
import {Image, Text, View} from 'react-native';

const ContactUs = () => {
    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Fale conosco"
                subtitle="Estamos aqui para ajudar"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className="flex-1 bg-white px-4 rounded-t-3xl">
                <View className="flex-row items-center justify-center my-8">
                    <Image
                        className="self-center"
                        source={require('@/assets/images/girl_background.png')}
                    />
                </View>

                <View className="flex-1 items-center">
                    <Text className="text-lg text-solar-blue-secondary my-4">
                        Para dúvidas, reclamações ou observações
                    </Text>

                    <Text className="text-2xl font-bold text-solar-blue-secondary pt-5">
                        51-3638-5000
                    </Text>
                    <Text className="text-lg font-medium text-solar-blue-secondary py-5">
                        sac@lojasolar.com.br
                    </Text>
                    <Text className="text-lg text-solar-blue-secondary">
                        Av. Duque de Caxias,385
                    </Text>
                    <Text className="text-lg text-solar-blue-secondary">
                        Centro - Salvador do Sul - RS
                    </Text>
                    <Text className="text-lg text-solar-blue-secondary">
                        CEP: 95750-000
                    </Text>
                </View>

                <Text className="text-sm font-medium text-solar-blue-secondary pt-4 text-center pb-2">
                    v{process.env.EXPO_PUBLIC_APP_VERSION}
                </Text>
            </View>
        </View>
    );
};

export default ContactUs;
