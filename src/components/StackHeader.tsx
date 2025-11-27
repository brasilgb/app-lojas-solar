import {useNavigation} from '@react-navigation/native';
import {router} from 'expo-router';
import {ChevronLeftIcon, MapIcon, MenuIcon, X} from 'lucide-react-native';
import React from 'react';
import {Image, View} from 'react-native';
import {Button} from './Button';

interface StackHeaderProps {
    left?: boolean;
    right?: boolean;
    drawer?: boolean;
    back?: boolean;
    close?: any;
    otherRoute?: any;
    drstack?: any;
}

const StackHeader = ({
    left,
    right,
    drawer,
    back,
    close,
    otherRoute,
    drstack,
}: StackHeaderProps) => {
    const navigation = useNavigation() as any;
    return (
        <View className="bg-solar-blue-primary h-24 flex-row items-center justify-between px-2">
            <View className="h-10 w-16 flex-row items-center justify-start">
                {back && (
                    <Button
                        label={<ChevronLeftIcon color={'white'} size={30} />}
                        onPress={() => router.back()}
                    />
                )}
                {drawer && (
                    <Button
                        label={<MenuIcon color={'white'} />}
                        onPress={() => navigation.openDrawer()}
                    />
                )}
            </View>
            <Image
                source={require('@/assets/images/logo_lojas_solar.png')}
                style={{width: 220, height: 40}}
            />
            <View className="h-16 w-16 flex-row items-center justify-end pr-3">
                {close && (
                    <X
                        size={30}
                        color={'white'}
                        onPress={() => router.replace(close)}
                    />
                )}
                {otherRoute && (
                    <Button
                        variant={'link'}
                        size={'icon'}
                        label={<MapIcon size={25} color={'white'} />}
                        onPress={otherRoute}
                    />
                )}
            </View>
        </View>
    );
};

export default StackHeader;
