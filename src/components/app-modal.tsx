import {
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    Modal,
    FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {Input} from './Input';
import {SafeAreaView} from 'react-native-safe-area-context';

interface AppModalProps {
    dataList: string[];
    label?: string;
    selectedValue: string | null;
    handleSelectValue: (value: string) => void;
    placeholder: string;
}

const AppModal = ({
    dataList,
    label,
    placeholder,
    selectedValue,
    handleSelectValue,
}: AppModalProps) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [modalVisible, setModalVisible] = useState(false);

    const onOpen = () => {
        setModalVisible(true);
    };

    const onClose = () => {
        setModalVisible(false);
        setSearchQuery('');
    };

    const RenderItem = ({item, index}: {item: string; index: number}) => (
        <TouchableOpacity
            key={index}
            onPress={() => {
                handleSelectValue(item);
                Keyboard.dismiss();
                onClose();
            }}
            className={`flex-row items-center justify-start bg-gray-50 mx-2 border-b border-gray-200`}
        >
            <View className="p-4 w-full">
                <Text
                    className={`text-sm text-solar-blue-secondary font-roboto font-bold`}
                >
                    {item}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const filteredData = dataList.filter(item =>
        item.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <>
            <View className="flex flex-col gap-1.5">
                {label && <Text className="text-base">{label}</Text>}
                <TouchableOpacity
                    className="border border-gray-400 py-2.5 px-4 rounded-lg bg-white flex-row justify-between items-center"
                    onPress={onOpen}
                >
                    <Text
                        className={
                            selectedValue ? 'text-black' : 'text-gray-500'
                        }
                    >
                        {selectedValue ? selectedValue : placeholder}
                    </Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={modalVisible}
                onRequestClose={onClose}
                animationType="slide"
                transparent={false}
            >
                <SafeAreaView className="flex-1 bg-white">
                    <View className="py-4 px-3">
                        <Input
                            placeholder="Pesquisar..."
                            placeholderTextColor="#888"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <FlatList
                        data={filteredData}
                        keyExtractor={item => item}
                        renderItem={({item, index}) => (
                            <RenderItem item={item} index={index} />
                        )}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    />
                    <View className="p-2">
                        <TouchableOpacity
                            onPress={onClose}
                            className="p-4 bg-gray-200 items-center rounded-lg"
                        >
                            <Text className="text-black font-bold">Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal>
        </>
    );
};

export default AppModal;
