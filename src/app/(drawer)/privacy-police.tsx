import ScreenHeader from '@/components/ScreenHeader';
import {MaterialIcons} from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import WebView from 'react-native-webview';

export const VIEW_WIDTH = Dimensions.get('window').width;
const PrivacyPolice = () => {
    function LoadingIndicatorView() {
        return (
            <ActivityIndicator
                size="large"
                color={'#0d3b85'}
                animating={true}
            />
        );
    }
    const dataHtml = {
        uri: 'http://services.gruposolar.com.br:8082/midias/img/politica.html',
    };

    let colorBar = Platform.OS === 'ios' ? 'rgba(0, 162, 227, 0)' : '#1a9cd9';
    const handlePressButtonAsync = async (url: any) => {
        let result = await WebBrowser.openBrowserAsync(url, {
            toolbarColor: colorBar,
            controlsColor: '#FFF',
        });
    };

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Política de privacidade"
                subtitle=""
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className=" bg-gray-100 rounded-t-3xl h-full gap-4">
                {dataHtml && (
                    <WebView
                        originWhitelist={['*']}
                        source={dataHtml}
                        renderLoading={LoadingIndicatorView}
                        startInLoadingState={true}
                        style={{
                            flex: 1,
                            width: VIEW_WIDTH - 4,
                            marginTop: 20,
                            backgroundColor: 'transparent',
                        }}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    />
                )}
            </View>
            <View className="py-4 w-full bg-solar-blue-light">
                <Text className="text-xs text-white text-center font-PoppinsRegular">
                    Para saber mais sobre nossa política de privacidade acesse
                </Text>
                <TouchableOpacity
                    className="flex-row items-center justify-center"
                    onPress={() =>
                        handlePressButtonAsync(
                            'https://www.lojasolar.com.br/duvidas?page=politica-de-privacidade',
                        )
                    }
                >
                    <MaterialIcons name="link" size={22} color={'#555'} />
                    <Text className="text-xs pl-2 text-[#555] text-center font-PoppinsRegular py-2 underline">
                        Política de privacidade Lojas Solar
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PrivacyPolice;
