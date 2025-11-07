import {View, Text} from 'react-native';
import React from 'react';
import ScreenHeader from '@/components/ScreenHeader';
import {Card, CardContent, CardTitle} from '@/components/Card';
import {CheckCircleIcon, CheckIcon} from 'lucide-react-native';
import {Button} from '@/components/Button';
import {router} from 'expo-router';

const CardBillPaid = () => {
    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Pagamentos"
                subtitle="Cartão de crédito"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-lg text-center"
            />
            <View className="p-4 bg-white rounded-t-3xl flex-1">
                <View className="flex-row justify-center gap-4 mt-10">
                    <CheckCircleIcon size={120} color={'#bccf00'} />
                </View>

                <View className="py-4 mt-10 flex-1">
                    <Text className="text-xl font-bold text-solar-blue-secondary text-center">
                        Cobrança gerada com sucesso!
                    </Text>
                </View>

                <View className="p-4">
                    <Button
                        variant={'secondary'}
                        size={'lg'}
                        label={'Retornar'}
                        onPress={() => router.replace('/')}
                    />
                </View>
            </View>
        </View>
    );
};

export default CardBillPaid;
