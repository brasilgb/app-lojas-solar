import { Text, TouchableOpacity, View, Dimensions, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Input } from './Input';
import { Modalize } from 'react-native-modalize';

interface StoreListProps {
    dataModal: any;
    onSelectCity: any;
    visible: any;
}

const StoreListModal = ({ dataModal, visible, onSelectCity }: StoreListProps) => {

    // Estado para o texto da busca
    const [searchQuery, setSearchQuery] = useState('');
    // Estado para a lista de cidades filtradas
    const [filteredCities, setFilteredCities] = useState<any>(dataModal);

    // useEffect para filtrar a lista sempre que o texto da busca mudar
    useEffect(() => {
        // Se a busca estiver vazia, mostramos todas as cidades
        if (searchQuery.trim() === '') {
            setFilteredCities(dataModal);
        } else {
            // Filtra o array CITIES original
            const newFilteredCities = dataModal.filter((city: any) => (city?.cidade.toLowerCase().includes(searchQuery.toLowerCase())));
            setFilteredCities(newFilteredCities);
        }
    }, [searchQuery, dataModal]); // O array de dependências faz com que este efeito rode apenas quando 'searchQuery' mudar

    const RenderItem = ({ item, index }: any) => (
        <TouchableOpacity
        key={index}
            onPress={() => {
                onSelectCity(item)
                Keyboard.dismiss()
                setSearchQuery('')
            }}
            className={`flex-row items-center justify-start bg-gray-50 mx-2 border-b border-gray-200`}
        >
            <View className="p-2 w-full">
                <Text className={`text-sm text-solar-blue-secondary font-roboto font-bold`}>
                    {item?.cidade}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <Modalize
            modalHeight={Dimensions.get('window').height - 150}
            modalTopOffset={80}
            ref={visible}
            HeaderComponent={
                <View className='py-4 px-3'>
                    <Input
                        className=''
                        placeholder="Buscar loja..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            }
            flatListProps={{
                data: filteredCities,
                keyExtractor: (item: any, index: any) => index,
                renderItem: ({ item }: { item: any }) => <RenderItem item={item} />,
                keyboardShouldPersistTaps: "handled",
                showsVerticalScrollIndicator: false
            }}
        />
    );
};

export default StoreListModal;