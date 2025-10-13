import React from 'react';
import WebView from 'react-native-webview';
import {Ionicons} from '@expo/vector-icons';
import {View} from 'react-native';
import { router } from 'expo-router';

const ViewDoc = ({route}: any) => {
    const {data} = route?.params;
    return (
        <>
            <View className="absolute top-6 right-5 z-20">
                <Ionicons
                    name="close"
                    size={34}
                    color={'white'}
                    onPress={() => router.replace('/')}
                />
            </View>
            <WebView source={{uri: data}} allowFileAccess={true} />
        </>
    );
};

export default ViewDoc;