import HistoryButton from '@/components/HistoryButton';
import { useAuthContext } from '@/contexts/AppContext';
import {
    BanknoteArrowDownIcon,
    HandCoinsIcon,
    HistoryIcon,
    MapPinIcon,
    PenLineIcon,
    PhoneCallIcon,
    ScanBarcodeIcon,
    ShoppingBasket,
    UserIcon,
    WrenchIcon,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Image,
    Platform,
    TouchableOpacity,
    View,
    Text,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import Carousel, { Pagination } from 'react-native-snap-carousel-v4';
import serviceapp from '@/services/serviceapp';
import AppLoading from '@/components/app-loading';
import { useFocusEffect } from 'expo-router';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

interface CarouselRenderItemProps {
    item: any;
    index: number;
}

const Home = () => {
    const { signedIn } = useAuthContext();
    const isCarousel: any = useRef(null);
    const [index, setIndex] = useState(0);
    const [carrocelData, setCarrocelData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

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

    const CarouselCardItem = ({ item }: CarouselRenderItemProps) => (
        <View className="flex-1 items-center justify-center w-full">
            <View className="bg-solar-gray-dark w-full">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handlePressButtonAsync(item.carLink)}
                >
                    <Image
                        source={{ uri: item.carLinkImagem }}
                        className="h-full w-full"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            {loading && carrocelData.length === 0 ? (
                <View className="z-50 h-[calc(100vh_-_39.9vh)] border-t border-y-solar-green-primary items-center justify-center">
                    <ActivityIndicator size="large" color="#1a9cd9" />
                </View>
            ) : (
                <View className="z-50 h-[calc(100vh_-_39.9vh)] border-t border-y-solar-green-primary items-center justify-center bg-solar-green-primary">

                    <Carousel
                        vertical={false}
                        layout="default"
                        layoutCardOffset={9}
                        ref={isCarousel}
                        data={carrocelData as any}
                        renderItem={({ item, index }) => (
                            <CarouselCardItem item={item} index={index} />
                        )}
                        sliderWidth={viewportWidth}
                        itemWidth={viewportWidth}
                        inactiveSlideShift={0}
                        useScrollView={true}
                        onSnapToItem={(index: any) => setIndex(index)}
                        autoplay={true}
                        autoplayDelay={1500}
                        autoplayInterval={4000}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                        loop
                        hasParallaxImages={true}
                    />

                    <View className="w-full z-50 border-y border-y-solar-green-primary shadow-md shadow-gray-800">
                        <Pagination
                            dotsLength={carrocelData}
                            activeDotIndex={index}
                            carouselRef={isCarousel}
                            dotStyle={{
                                width: 20,
                                height: 20,
                                borderRadius: 50,
                                marginTop: 15,
                                backgroundColor: '#bccf00',
                            }}
                            inactiveDotOpacity={0.4}
                            inactiveDotScale={0.6}
                            tappableDots={true}
                            containerStyle={{
                                height: 15,
                                backgroundColor: '#0380b9',
                            }}
                        />
                    </View>
                </View>
            )}

            <ScrollView className="bg-white">
                <View className="flex-row flex-wrap items-start justify-between gap-3 p-3">
                    <TouchableOpacity
                        style={{ elevation: 2 }}
                        onPress={() =>
                            handlePressButtonAsync(
                                'https://www.lojasolar.com.br/',
                            )
                        }
                        className={`w-[112px] h-[90px] bg-solar-green-primary rounded-lg items-center justify-around shadow-md shadow-gray-800 border border-solar-blue-secundary`}
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
