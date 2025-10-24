import HistoryButton from "@/components/HistoryButton";
import { useAuthContext } from "@/contexts/AppContext";
import { BanknoteArrowDownIcon, HandCoinsIcon, HistoryIcon, MapPinIcon, PenLineIcon, PhoneCallIcon, ScanBarcodeIcon, ShoppingBasket, WrenchIcon } from "lucide-react-native";
import React from "react";
import { Image, Platform, TouchableOpacity, View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as WebBrowser from 'expo-web-browser';

const Home = () => {
  const { signedIn } = useAuthContext();

  let colorBar = Platform.OS === 'ios' ? 'rgba(0, 162, 227, 0)' : '#1a9cd9';
  const handlePressButtonAsync = async (url: any) => {
    let result = await WebBrowser.openBrowserAsync(url, {
      toolbarColor: colorBar,
      controlsColor: '#FFF',
    });
  };

  return (
    <>
      <View className="w-full border-y-2 border-y-solar-green-primary">
        <Image source={require("@/assets/images/test-slide.png")} className="h-[394px] w-[384px] bg-cover bg-top" />
      </View>

      <ScrollView className="bg-white">

        <View className="flex-row flex-wrap items-start justify-start gap-4 p-4">

          <TouchableOpacity
            style={{ elevation: 2 }}
            onPress={() => handlePressButtonAsync('https://www.lojasolar.com.br/')}
            className={`w-[109px] h-[109px] bg-solar-green-primary rounded-lg items-center justify-around shadow shadow-black`}
          >
            <Text className={`text-sm text-solar-blue-secundary font-RobotoRegular`}>Comprar</Text>
            <ShoppingBasket size={45} color={'#0d3b85'} />
          </TouchableOpacity>

          <HistoryButton
            bgButton="bg-solar-green-primary"
            colorText="text-solar-blue-secundary"
            icon={<PenLineIcon size={45} color={'#0d3b85'} />}
            label="Assinar doc."
            url={!signedIn ? '/sign-in' : '/docsassign'}
          />

          <HistoryButton
            bgButton="bg-solar-green-primary"
            colorText="text-solar-blue-secundary"
            icon={<HandCoinsIcon size={45} color={'#0d3b85'} />}
            label="Pagamentos"
            url={!signedIn ? '/sign-in' : '/payment'}
          />

          <HistoryButton
            bgButton="bg-solar-green-primary"
            colorText="text-solar-blue-secundary"
            icon={<BanknoteArrowDownIcon size={45} color={'#0d3b85'} />}
            label="Cashback"
            url={!signedIn ? '/sign-in' : '/cashback'}
          />

          <HistoryButton
            bgButton="bg-solar-green-primary"
            colorText="text-solar-blue-secundary"
            icon={<MapPinIcon size={45} color={'#0d3b85'} />}
            label="Lojas"
            url={'(stores)'}
          />

          <HistoryButton
            bgButton="bg-solar-green-primary"
            colorText="text-solar-blue-secundary"
            icon={<WrenchIcon size={45} color={'#0d3b85'} />}
            label="Assistência"
            url={!signedIn ? '/sign-in' : '/assistance'}
          />

          <HistoryButton
            bgButton="bg-solar-green-primary"
            colorText="text-solar-blue-secundary"
            icon={<PhoneCallIcon size={45} color={'#0d3b85'} />}
            label="Fale conosco"
            url={'/contact-us'}
          />

          <HistoryButton
            bgButton="bg-solar-green-primary"
            colorText="text-solar-blue-secundary"
            icon={<HistoryIcon size={45} color={'#0d3b85'} />}
            label="Histórico"
            url={!signedIn ? '/sign-in' : '/history'}
          />

          <HistoryButton
            bgButton="bg-solar-green-primary"
            colorText="text-solar-blue-secundary"
            icon={<ScanBarcodeIcon size={45} color={'#0d3b85'} />}
            label="2ª via boleto"
            url={!signedIn ? '/sign-in' : '/'}
          />
        </View>
      </ScrollView>
    </>
  )
}

export default Home