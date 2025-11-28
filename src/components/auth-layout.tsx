import {Image, KeyboardAvoidingView, Platform, View} from 'react-native';
import React, {ReactNode} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

interface AuthLayoutProps {
    children: ReactNode;
}

const AuthLayout = ({children}: AuthLayoutProps) => {
    return (
        <SafeAreaView className="flex-1 bg-solar-blue-primary">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{flex: 1}}
            >
                <View className="flex-1 justify-center items-center bg-solar-blue-primary px-3">
                    <View className="mb-16">
                        {/* <Image source={require('@/assets/images/logo_lojas_solar.png')}  style={{ width: 300, height: 54 }} /> */}
                    </View>
                    <View
                        className="min-h-52 w-full bg-gray-50 border-4 border-white rounded-lg py-3"
                        style={{elevation: 2}}
                    >
                        {children}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AuthLayout;
