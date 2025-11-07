import {Image, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MenuIcon} from 'lucide-react-native';
import {Button} from '@/components/Button';

const DrawerHeader = () => {
    const navigation = useNavigation() as any;
    const {top} = useSafeAreaInsets();
    return (
        <View className="bg-solar-blue-primary h-24 flex-row items-center justify-between px-2">
            <View>
                <Button
                    label={<MenuIcon color={'white'} />}
                    onPress={() => navigation.openDrawer()}
                />
            </View>
            <Image
                source={require('@/assets/images/logo_lojas_solar.png')}
                style={{width: 220, height: 40}}
            />
            <Text></Text>
        </View>
    );
};

export default DrawerHeader;
