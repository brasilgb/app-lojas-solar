import AppLoading from '@/components/app-loading';
import {Button} from '@/components/Button';
import ScreenHeader from '@/components/ScreenHeader';
import {useAuthContext} from '@/contexts/AppContext';
import docscanner from '@/services/docscanner';
import {useIsFocused} from '@react-navigation/native';
import {FlashList} from '@shopify/flash-list';
import {router, useFocusEffect} from 'expo-router';
import React, {useCallback, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';

const DocsAssign = () => {
    const {user} = useAuthContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [assignDocs, setAssignDocs] = useState<any>([]);
    const isFocused = useIsFocused();

    const getAssignDocs = async () => {
        setLoading(true);
        await docscanner
            .post('(WS_SIGNATURES_BY_CUSTOMER)', {
                code: user?.codigoCliente,
            })
            .then(res => {
                const {signatures, message, token} = res.data.response;

                if (signatures === undefined) {
                    setAssignDocs([]);
                    return;
                }
                setAssignDocs(signatures);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setLoading(false));
    };

    useFocusEffect(
        useCallback(() => {
            getAssignDocs();
        }, []),
    );

    const RenderDocs = ({item}: any) => (
        <View className="flex-col items-center justify-between my-1 px-4 rounded-xl text-lg leading-6 font-medium bg-white border border-gray-300 shadow-sm shadow-gray-300 py-4">
            <View className="flex-row items-center justify-between mb-2 bg-gray-200 rounded-md w-full p-2">
                <Text className="text-sm font-bold">Data: {item.date}</Text>
                <Text className="text-sm font-bold">NF: {item.number}</Text>
                <Text className="text-sm font-bold">Filial: {item.origin}</Text>
                <Text className="text-sm font-bold">Série: {item.serie}</Text>
            </View>
            <View>
                <Text className="text-sm font-bold  text-solar-blue-dark">
                    Documento: {item.link}
                </Text>
            </View>
            <View className="mt-2">
                <Button
                    size={'lg'}
                    label={'Assinar documento'}
                    variant={'default'}
                    onPress={() =>
                        router.push({
                            pathname: '/view-doc',
                            params: item,
                        })
                    }
                />
            </View>
        </View>
    );

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Assinatura de documentos"
                subtitle="Documentos disponíveis para assinatura"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className=" bg-gray-100 rounded-t-3xl h-full gap-4 flex-1 p-4">
                <View className="flex-1 items-center justify-start bg-solar-gray-dark">
                    <View className="flex-1 flex-col items-center justify-center w-full">
                        {assignDocs.length === 0 && !loading && (
                            <View className="py-2 px-2 bg-solar-red-primary rounded-md">
                                <Text className="text-base text-white">
                                    No momento não há documentos a serem
                                    assinados
                                </Text>
                            </View>
                        )}

                        <View className="flex-1 w-full">
                            <FlashList
                                data={assignDocs}
                                renderItem={({item}: {item: any}) => (
                                    <RenderDocs item={item} />
                                )}
                                keyExtractor={(item: any) => item.number}
                                keyboardShouldPersistTaps={'always'}
                                showsVerticalScrollIndicator={false}
                                onRefresh={getAssignDocs}
                                refreshing={loading}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default DocsAssign;
