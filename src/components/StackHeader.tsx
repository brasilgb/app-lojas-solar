import { Image, View } from 'react-native'
import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react'
import { ChevronLeftIcon, ListIcon, ListTodo, MenuIcon, X } from 'lucide-react-native';
import { Button } from './Button';
import { router } from 'expo-router';

interface StackHeaderProps {
    left?: boolean;
    right?: boolean;
    drawer?: boolean;
    back?: boolean;
    close?: boolean;
    otherRoute?: any;
    drstack?: any;
}

const StackHeader = ({ left, right, drawer, back, close, otherRoute, drstack }: StackHeaderProps) => {
    const navigation = useNavigation() as any;
    return (
        <View className='bg-solar-blue-primary h-24 flex-row items-center justify-between px-2'>
            <View className='h-10 w-16 flex-row items-center justify-start'>
                {back &&
                    <Button
                        label={<ChevronLeftIcon color={'white'} size={30} />}
                        onPress={() => router.back()}
                    />
                }
                {drawer &&
                    <Button
                        label={<MenuIcon color={'white'} />}
                        onPress={() => navigation.openDrawer()}
                    />
                }
            </View>
            <Image source={require('@/assets/images/logo_lojas_solar.png')} className='h-10 w-3/5' />
            <View className='h-10 w-16 flex-row items-center justify-end pr-3'>
                {close &&
                    <X size={30} color={'white'} onPress={() => router.replace('/(drawer)')} />
                }
                {otherRoute &&
                    <Button
                        label={<ListIcon color={'white'} />}
                        onPress={otherRoute}
                    />
                }
            </View>
        </View>
    )
}

export default StackHeader