import HistoryButton from "@/components/HistoryButton";
import { useAuthContext } from "@/contexts/AppContext";
import { BanknoteArrowDownIcon, CopyIcon, HandCoinsIcon, HistoryIcon, MapPinIcon, PenLineIcon, PhoneCallIcon, QrCodeIcon, ScanBarcodeIcon, Share2Icon, ShoppingBasket, WrenchIcon } from "lucide-react-native";
import React from "react";
import { Image, Platform, TouchableOpacity, View, Text } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as WebBrowser from 'expo-web-browser';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/Card";
import { maskMoney } from "@/lib/mask";

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
        {/* <View className="p-4">
          <Card className="items-center bg-white border-gray-300 shadow-sm shadow-slate-900">
            <CardHeader>
              <Text className="text-5xl font-extrabold text-solar-blue-secondary/80">R$ {maskMoney('1562.25')}</Text>
            </CardHeader>
            <CardTitle className="text-xl text-gray-500 font-normal pb-2">
              Validade do QRCode 1h(uma hora)
            </CardTitle>
            <CardContent>
              <QrCodeIcon size={150} color={'#0d3b85'} />
            </CardContent>
            <CardFooter>
              <Text className="text-center text-solar-blue-primary">Use o leitor de QRCode para fazer a transação ou escolha uma opção abaixo.</Text>
            </CardFooter>
          </Card>
          <View className="flex-row items-center justify-around gap-4 mt-8">
            <Card className="items-center bg-white border-gray-300 shadow-sm shadow-slate-900 p-2">
              <CardHeader>
                <CopyIcon size={60} color={'#0d3b85d5'} />
              </CardHeader>
              <CardTitle className="text-base text-gray-500 font-normal">PIX copia e cola</CardTitle>
            </Card>
            <Card className="items-center bg-white border-gray-300 shadow-sm shadow-slate-900 p-2">
              <CardHeader>
                <Share2Icon size={60} color={'#0d3b85d5'} />
              </CardHeader>
              <CardTitle className="text-base text-gray-500 font-normal">Compartilhar PIX</CardTitle>
            </Card>
          </View>
        </View> */}

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