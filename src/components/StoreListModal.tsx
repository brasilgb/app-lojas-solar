import {Text, TouchableOpacity, View, Dimensions, Keyboard} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Input} from './Input';
import {Modalize} from 'react-native-modalize';

interface StoreListProps {
    dataModal: any[];
    onSelectCity: (city: string) => void;
    modalizeRef: React.RefObject<Modalize>;
}

const StoreListModal = ({
    dataModal,
    modalizeRef,
    onSelectCity,
}: StoreListProps) => {
    // Estado para o texto da busca
    const [searchQuery, setSearchQuery] = useState('');
    // Estado para a lista de cidades filtradas
    const [filteredCities, setFilteredCities] = useState<any[]>([]);

    // useEffect para filtrar a lista sempre que o texto da busca mudar
    useEffect(() => {
        if (dataModal) {
            if (searchQuery.trim() === '') {
                setFilteredCities(dataModal);
            } else {
                const newFilteredCities = dataModal.filter((city: string) =>
                    city.toLowerCase().includes(searchQuery.toLowerCase()),
                );
                setFilteredCities(newFilteredCities);
            }
        }
    }, [searchQuery, dataModal]);

    const RenderItem = ({item, index}: {item: any; index: number}) => (
        <TouchableOpacity
            key={index}
            onPress={() => {
                onSelectCity(item);
                Keyboard.dismiss();
                setSearchQuery('');
            }}
            className={`flex-row items-center justify-start bg-gray-50 mx-2 border-b border-gray-200`}
        >
            <View className="p-2 w-full">
                <Text
                    className={`text-sm text-solar-blue-secondary font-roboto font-bold`}
                >
                    {item?.cidade}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <Modalize
            modalHeight={Dimensions.get('window').height - 150}
            modalTopOffset={80}
            ref={modalizeRef}
            HeaderComponent={
                <View className="py-4 px-3">
                    <Input
                        className=""
                        placeholder="Buscar loja..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            }
            flatListProps={{
                data: filteredCities,
                keyExtractor: (item: any, index: any) => `${item}-${index}`,
                renderItem: ({item, index}: {item: any; index: number}) => (
                    <RenderItem item={item} index={index} />
                ),
                keyboardShouldPersistTaps: 'handled',
                showsVerticalScrollIndicator: false,
            }}
        />
    );
};

export default StoreListModal;
