import { Image, View } from 'react-native'
import React from 'react'
import { ChevronLeftIcon, X } from 'lucide-react-native';

interface CustomHeaderProps {
    left?: boolean;
    right?: boolean;
    lurl?: () => void;
    rurl?: () => void;
}

const CustomHeader = ({ left, right, lurl, rurl }: CustomHeaderProps) => {

    return (
        <View className='bg-solar-blue-primary h-24 flex-row items-center justify-between px-4'>
            <View className='h-10 w-10 items-center justify-center'>
                {left &&
                    <ChevronLeftIcon size={30} color={'white'} className='h-8 w-8' onPress={lurl} />
                }
            </View>
            <Image source={require('@/assets/images/logo_lojas_solar.png')} className='h-10 w-3/5' />
            <View className='h-10 w-10 items-center justify-center'>
                {right &&
                    <X size={30} color={'white'} className='h-8 w-8' onPress={rurl} />
                }
            </View>
        </View>
    )
}

export default CustomHeader