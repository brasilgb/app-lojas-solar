import React, {useState} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
import {Button} from './Button';
import {
    Card,
    CardTitle,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/Card';

const MessageAlert = ({visible, onClose, title, message}) => {
    return (
        <Modal
            animationType="fade" // Ou "fade", "none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/30 justify-center items-center">
                <Card
                    className="m-5 bg-white rounded-2xl !border-2 border-gray-100 px-2 w-4/5"
                    style={styles.modalView}
                >
                    <CardHeader className="flex-row justify-center">
                        <CardTitle className="text-2xl font-semibold tracking-tight text-primary-600 mb-2">
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-row justify-center">
                        <Text className="text-lg">{message}</Text>
                    </CardContent>
                    <CardFooter className="flex-row justify-center">
                        <Button
                            label="Fechar"
                            variant="default"
                            size="default"
                            onPress={onClose}
                        />
                    </CardFooter>
                </Card>
            </View>
        </Modal>
    );
};

// Estilos (adaptar conforme necessário)
const styles = StyleSheet.create({
    modalView: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5, // Sombras para Android
    },
});

export default MessageAlert;
