import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { BanknoteArrowDownIcon, HandCoinsIcon, HandshakeIcon, HistoryIcon, HomeIcon, LogOut, MapPinIcon, MenuIcon, PenLineIcon, PhoneCallIcon, RotateCcwKey, ShieldUserIcon, UserIcon, WrenchIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { View, Text } from 'react-native';
import { Link, router } from 'expo-router';
import CustomHeader from '@/components/DrawerHeader';
import { useAuthContext } from '@/contexts/AppContext';

const CustomDrawerContent = (props: any) => {
  const { top, bottom } = useSafeAreaInsets();
  const { signedIn, signOut, user } = useAuthContext();

  return (
    <View className='flex-1'>
      <View className="items-center justify-center py-4 bg-solar-blue-primary">
        <View className="mt-4 w-24 h-24 rounded-full border-4 border-solar-green-primary bg-white items-center justify-center mb-4">
          <UserIcon size={60} color={'#1a9cd9'} />
        </View>
        <Text className="text-white">{user?.nomeCliente}</Text>
      </View>
      <DrawerContentScrollView
        {...props}
        scrollEnabled={true}
        drawerHideStatusBarOnOpen={'slide'}
        contentContainerStyle={{ backgroundColor: '#ffffff' }}>
        <View className="bg-white">
          <DrawerItemList {...props} />
          <DrawerItem
            icon={({ color, size }) => <LogOut color={color} size={size} />}
            label={signedIn ? 'Sair' : 'Login'}
            onPress={() => signedIn ? signOut() : router.push('/(auth)/sign-in')}
          />
        </View>
      </DrawerContentScrollView>
      <View className={`flex-row items-center justify-between p-5 border-t border-t-gray-200`} >
        <Link className="text-xs text-gray-600" href={'/'}>Política de Privacidade</Link>
        <Link className="text-xs text-gray-600" href={'/'}>Perguntas frequentes</Link>
      </View>
    </View>
  )
}
const DrawerLayout = () => {
  const { signedIn } = useAuthContext();
  return (
    <GestureHandlerRootView>
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: false,
          drawerType: 'slide',
          drawerActiveBackgroundColor: '#1a9cd9',
          drawerActiveTintColor: '#f1f1f1',
          header: () => <CustomHeader />,
        }}
      >
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'Home',
            drawerIcon: ({ color, size }) => (
              <HomeIcon color={color} size={size} />
            )
          }}
        />

        <Drawer.Screen
          name="(tabs)/(account)" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Minha conta/Alterar Senha',
            title: 'Minha conta',
            drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
            drawerIcon: ({ color, size }) => (
              <UserIcon color={color} size={size} />
            )
          }}
        />

        <Drawer.Screen
          name="crediary" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Crediário',
            title: 'Crediário',
            drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
            drawerIcon: ({ color, size }) => (
              <HandshakeIcon color={color} size={size} />
            )
          }}
        />

        <Drawer.Screen
          name="sign-documents" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Assinar documentos',
            title: 'Assinar documentos',
            drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
            drawerIcon: ({ color, size }) => (
              <PenLineIcon color={color} size={size} />
            )
          }}
        />

        <Drawer.Screen
          name="privacy-settings" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Conf. de privacidade',
            title: 'Conf. de privacidade',
            drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
            drawerIcon: ({ color, size }) => (
              <ShieldUserIcon color={color} size={size} />
            )
          }}
        />

        <Drawer.Screen
          name="(stores)" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Lojas solar próximas',
            title: 'Lojas solar próximas',
            drawerIcon: ({ color, size }) => (
              <MapPinIcon color={color} size={size} />
            )
          }}
        />

        <Drawer.Screen
          name="contact-us" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Fale conosco',
            title: 'Fale conosco',
            drawerIcon: ({ color, size }) => (
              <PhoneCallIcon color={color} size={size} />
            )
          }}
        />

        <Drawer.Screen
          name="make-payment" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Faça seu pagamento',
            title: 'Faça seu pagamento',
            drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
            drawerIcon: ({ color, size }) => (
              <HandCoinsIcon color={color} size={size} />
            )
          }}
        />

        <Drawer.Screen
          name="cashback" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Cashback',
            title: 'Cashback',
            drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
            drawerIcon: ({ color, size }) => (
              <BanknoteArrowDownIcon color={color} size={size} />
            )
          }}
        />

        <Drawer.Screen
          name="purchase-history" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Histórico de compras',
            title: 'Histórico de compras',
            drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
            drawerIcon: ({ color, size }) => (
              <HistoryIcon color={color} size={size} />
            )
          }}
        />

        <Drawer.Screen
          name="assistance-protocol" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Protocolo de assistência',
            title: 'Protocolo de assistência',
            drawerItemStyle: { display: signedIn ? 'flex' : 'none' },
            drawerIcon: ({ color, size }) => (
              <WrenchIcon color={color} size={size} />
            )
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
export default DrawerLayout