import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {useLocalSearchParams} from 'expo-router';
import {Text, View, ActivityIndicator} from 'react-native';

const ViewDoc = () => {
    const params = useLocalSearchParams() as any;
    const [visible, setVisible] = useState(false);
    return (
        <>
            {visible ? (
                <ActivityIndicator size="large" color="#1a9cd9" />
            ) : null}
            <WebView
                source={{uri: params?.link}}
                allowFileAccess={true}
                onLoadStart={() => setVisible(true)}
                onLoad={() => setVisible(false)}
                style={{height: 100}}
            />
        </>
    );
};

export default ViewDoc;
