import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer"
import { Link } from "expo-router";
import { LogOut, UserIcon } from "lucide-react-native";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomDrawerContent = (props: any) => {

    const { top, bottom } = useSafeAreaInsets();

    return (
        <View className="flex-1">
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: '#1a9cd9', padding: 0 }}
                scrollEnabled={true}>
                <View className="items-center justify-center py-5">
                    <View className="w-24 h-24 rounded-full border-4 border-solar-green-primary bg-white items-center justify-center mb-4">
                        <UserIcon size={60} color={'#1a9cd9'} />
                    </View>
                    <Text className="text-gray-600">Anderson rogério Brasil Rodrigues</Text>
                </View>
                <View className="bg-white w-full">
                    <DrawerItemList {...props} />
                    <DrawerItem
                        icon={({ color, size }) => <LogOut color={color} size={size} />}
                        label={'Sair'}
                        onPress={() => console.log('sair')}
                    />
                </View>
            </DrawerContentScrollView>
            <View className={`flex-row items-center justify-between p-5 border-t border-t-gray-200`} style={{ paddingBottom: bottom }}>
                <Link className="text-xs text-gray-600" href={'/'}>Política de Privacidade</Link>
                <Link className="text-xs text-gray-600" href={'/'}>Perguntas frequentes</Link>
            </View>
        </View>
    )
}

export default CustomDrawerContent