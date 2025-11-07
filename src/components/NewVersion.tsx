import React from 'react';
import {View, Text, Platform, Linking} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import {Button} from './Button';

const VerifyVersion = ({route, onClose}: any) => {
    const {data} = route.params;

    const handlerVersioning = () => {
        const os = Platform.OS;
        if (Platform.OS === 'android') {
            Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.loja.solar',
            );
        }
        if (Platform.OS === 'ios') {
            Linking.openURL(
                'https://apps.apple.com/br/app/loja-solar/id6468680373',
            );
        }
    };

    return (
        <View>
            <View className="flex-1 bg-gray-50 pt-4">
                <View className="flex-1 flex-col items-center justify-between px-12 pt-4 mb-10">
                    <View className="mb-10">
                        <Text className="text-3xl text-solar-blue-secondary py-8 text-center font-bold uppercase">
                            Nova versão do aplicativo disponível
                        </Text>
                        <Text className="text-lg text-solar-blue-dark font-PoppinsRegular mb-4 px-8 text-center">
                            Está disponível a nova versão do aplicativo das
                            Lojas Solar, clique no botão atualizar para realizar
                            a atualização.
                        </Text>
                    </View>
                    <View>
                        <FontAwesome
                            name="gears"
                            size={120}
                            color={'#bccf00'}
                        />
                    </View>
                    <View className="py-4 mt-10">
                        <Text className="text-sm font-semibold">
                            Versão atual: {data.atual}
                        </Text>
                        <Text className="text-sm font-semibold">
                            Versão indicada: {data.nova}
                        </Text>
                    </View>
                    <View className="w-full gap-8">
                        <Button
                            size={'default'}
                            label={'Atualizar agora'}
                            onPress={handlerVersioning}
                            variant={'secondary'}
                        />
                        <Button
                            size={'sm'}
                            label={'Gostaria de atualizar mais tarde'}
                            onPress={onClose}
                            variant={'link'}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default VerifyVersion;
