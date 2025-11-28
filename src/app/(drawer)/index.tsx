import HistoryButton from '@/components/HistoryButton';
import { useAuthContext } from '@/contexts/AppContext';
import serviceapp from '@/services/serviceapp';
import { useFocusEffect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import {
    BanknoteArrowDownIcon,
    HandCoinsIcon,
    HistoryIcon,
    MapPinIcon,
    PenLineIcon,
    PhoneCallIcon,
    ShoppingBasket,
    UserIcon,
    WrenchIcon
} from 'lucide-react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');


const Home = () => {
    const { signedIn } = useAuthContext();
    const isCarousel: any = useRef(null);
    const [index, setIndex] = useState(0);
    const [carrocelData, setCarrocelData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const carouselRef = useRef<ICarouselInstance>(null);

    let colorBar = Platform.OS === 'ios' ? 'rgba(0, 162, 227, 0)' : '#1a9cd9';
    const handlePressButtonAsync = async (url: any) => {
        let result = await WebBrowser.openBrowserAsync(url, {
            toolbarColor: colorBar,
            controlsColor: '#FFF',
        });
    };

    async function getCarrocel() {
        setLoading(true);
        await serviceapp
            .get(`(WS_CARROCEL_PROMOCAO)`)
            .then(response => {
                const { data } = response.data.resposta;
                setCarrocelData(data.carrocel);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    }

    useFocusEffect(
        useCallback(() => {
            getCarrocel();
        }, []),
    );

    const CarouselCardItem = ({ item }: { item: any }) => (
        <View className="flex-1 items-center justify-center w-full">
            <View className="bg-solar-gray-dark w-full">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handlePressButtonAsync(item.carLink)}
                >
                    <Image
                        source={{ uri: item.carLinkImagem }}
                        defaultSource={require('@/assets/images/default-slide.png')}
                        style={{ width: viewportWidth, height: 410, resizeMode: 'contain' }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            {loading && carrocelData.length === 0 ? (
                <View className="z-50 h-[410] border-t border-t-solar-green-primary items-center justify-center">
                    <ActivityIndicator size="large" color="#1a9cd9" />
                </View>
            ) : (
                <View className="h-[410] border-t border-t-solar-green-primary items-center justify-center bg-solar-green-primary">
                    <Carousel
                        loop={true}
                        width={viewportWidth}
                        height={410}
                        autoPlay={carrocelData.length > 1 ? true : false}
                        autoPlayInterval={3000}
                        data={carrocelData}
                        onSnapToItem={(index: any) => setIndex(index)}
                        renderItem={({ item }) => <CarouselCardItem item={item} />}
                    />
                </View>
            )}

            <ScrollView className="bg-white border-t border-y-solar-green-primary">
                <View className="flex-row flex-wrap items-start justify-between gap-3 p-3">
                    <TouchableOpacity
                        style={{ elevation: 2 }}
                        onPress={() =>
                            handlePressButtonAsync(
                                'https://www.lojasolar.com.br/',
                            )
                        }
                        className={`w-[112px] h-[90px] bg-solar-green-primary rounded-lg items-center justify-around shadow-md shadow-gray-800 border border-solar-blue-secondary`}
                    >
                        <Text
                            className={`text-sm text-solar-blue-secundary font-RobotoRegular`}
                        >
                            Comprar
                        </Text>
                        <ShoppingBasket size={45} color={'#0d3b85'} />
                    </TouchableOpacity>

                    <HistoryButton
                        bgButton="bg-solar-green-primary"
                        colorText="text-solar-blue-secondary"
                        icon={<PenLineIcon size={45} color={'#0d3b85'} />}
                        label="Assinar doc."
                        url={!signedIn ? '/sign-in' : '/docsassign'}
                    />

                    <HistoryButton
                        bgButton="bg-solar-green-primary"
                        colorText="text-solar-blue-secondary"
                        icon={<HandCoinsIcon size={45} color={'#0d3b85'} />}
                        label="Pagamentos"
                        url={!signedIn ? '/sign-in' : '/payment'}
                    />

                    <HistoryButton
                        bgButton="bg-solar-green-primary"
                        colorText="text-solar-blue-secondary"
                        icon={
                            <BanknoteArrowDownIcon
                                size={45}
                                color={'#0d3b85'}
                            />
                        }
                        label="Cashback"
                        url={!signedIn ? '/sign-in' : '/cashback'}
                    />

                    <HistoryButton
                        bgButton="bg-solar-green-primary"
                        colorText="text-solar-blue-secondary"
                        icon={<MapPinIcon size={45} color={'#0d3b85'} />}
                        label="Lojas"
                        url={'(stores)'}
                    />

                    <HistoryButton
                        bgButton="bg-solar-green-primary"
                        colorText="text-solar-blue-secondary"
                        icon={<WrenchIcon size={45} color={'#0d3b85'} />}
                        label="Assistência"
                        url={!signedIn ? '/sign-in' : '/assistance'}
                    />

                    <HistoryButton
                        bgButton="bg-solar-green-primary"
                        colorText="text-solar-blue-secondary"
                        icon={<PhoneCallIcon size={45} color={'#0d3b85'} />}
                        label="Fale conosco"
                        url={'/contact-us'}
                    />

                    <HistoryButton
                        bgButton="bg-solar-green-primary"
                        colorText="text-solar-blue-secondary"
                        icon={<HistoryIcon size={45} color={'#0d3b85'} />}
                        label="Histórico"
                        url={!signedIn ? '/sign-in' : '/history'}
                    />

                    <HistoryButton
                        bgButton="bg-solar-green-primary"
                        colorText="text-solar-blue-secundary"
                        icon={<UserIcon size={45} color={'#0d3b85'} />}
                        label="Minha conta"
                        url={!signedIn ? '/sign-in' : '/my-account'}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;
