import {View, Text, TouchableOpacity} from 'react-native';
import React, {ReactNode} from 'react';
import {Link, router} from 'expo-router';

interface HistoryButtonProps {
    icon: any;
    label: string;
    colorText: string;
    bgButton: string;
    url: any;
}

const HistoryButton = ({
    icon,
    label,
    colorText,
    url,
    bgButton,
}: HistoryButtonProps) => {
    return (
        <TouchableOpacity
            style={{elevation: 2}}
            onPress={() => router.push(url)}
            className={`w-[112px] h-[90px] ${bgButton} rounded-lg items-center justify-around shadow-md shadow-gray-800 border border-solar-blue-secondary`}
        >
            <Text className={`text-sm ${colorText} font-RobotoRegular`}>
                {label}
            </Text>
            {icon}
        </TouchableOpacity>
    );
};

export default HistoryButton;
