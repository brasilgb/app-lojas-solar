import HistoryButton from "@/components/HistoryButton";
import { useAuthContext } from "@/contexts/AppContext";
import { BanknoteArrowDownIcon, HandCoinsIcon, HistoryIcon, MapPinIcon, PenLineIcon, PhoneCallIcon, ScanBarcodeIcon, ShoppingBasket, User2Icon, UserCircle2Icon, UserIcon, WrenchIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Image, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Home = () => {
  const { signedIn } = useAuthContext();

  const [ loading, setLoading ] = useState<boolean>(false);
  return (
    <>
      <View className="w-full border-y-2 border-y-solar-green-primary">
        <Image source={require("@/assets/images/test-slide.png")} className="h-[394px] w-[384px] bg-cover bg-top" />
      </View>

      <ScrollView className="bg-white">
          <View className="flex-row flex-wrap items-start justify-start gap-4 p-4">

            <HistoryButton
              bgButton="bg-solar-green-primary"
              colorText="text-solar-blue-secundary"
              icon={<ShoppingBasket size={45} color={'#0d3b85'} />}
              label="Comprar"
              url={'/'}
            />

            <HistoryButton
              bgButton="bg-solar-green-primary"
              colorText="text-solar-blue-secundary"
              icon={<PenLineIcon size={45} color={'#0d3b85'} />}
              label="Assinar doc."
              url={!signedIn ? '/sign-in' : '/'}
            />

            <HistoryButton
              bgButton="bg-solar-green-primary"
              colorText="text-solar-blue-secundary"
              icon={<HandCoinsIcon size={45} color={'#0d3b85'} />}
              label="Pagamentos"
              url={!signedIn ? '/sign-in' : '/'}
            />

            <HistoryButton
              bgButton="bg-solar-green-primary"
              colorText="text-solar-blue-secundary"
              icon={<BanknoteArrowDownIcon size={45} color={'#0d3b85'} />}
              label="Cashback"
              url={!signedIn ? '/sign-in' : '/'}
            />

            <HistoryButton
              bgButton="bg-solar-green-primary"
              colorText="text-solar-blue-secundary"
              icon={<MapPinIcon size={45} color={'#0d3b85'} />}
              label="Lojas"
              url={'/'}
            />

            <HistoryButton
              bgButton="bg-solar-green-primary"
              colorText="text-solar-blue-secundary"
              icon={<WrenchIcon size={45} color={'#0d3b85'} />}
              label="Assistência"
              url={!signedIn ? '/sign-in' : '/'}
            />

            <HistoryButton
              bgButton="bg-solar-green-primary"
              colorText="text-solar-blue-secundary"
              icon={<PhoneCallIcon size={45} color={'#0d3b85'} />}
              label="Fale conosco"
              url={'/'}
            />

            <HistoryButton
              bgButton="bg-solar-green-primary"
              colorText="text-solar-blue-secundary"
              icon={<HistoryIcon size={45} color={'#0d3b85'} />}
              label="Histórico"
              url={!signedIn ? '/sign-in' : '/'}
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