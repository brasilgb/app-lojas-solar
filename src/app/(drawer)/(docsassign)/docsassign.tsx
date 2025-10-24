import AppLoading from '@/components/app-loading';
import ScreenHeader from '@/components/ScreenHeader';
import { useAuthContext } from '@/contexts/AppContext';
import docscanner from '@/services/docscanner';
import { useIsFocused } from '@react-navigation/native';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

const DocsAssign = () => {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [assignDocs, setAssignDocs] = useState<any>([]);
    const isFocused = useIsFocused();
    useFocusEffect(
        useCallback(() => {
            const getAssignDocs = async () => {
                setLoading(true);
                await docscanner
                    .post('(WS_SIGNATURES_BY_CUSTOMER)', {
                        code: user?.codigoCliente,
                    })
                    .then(res => {
                        const { signatures, message, token } = res.data.response;
                        
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
            getAssignDocs();
        }, [user, isFocused])
    );

    if (loading) {
        <AppLoading />
    }

    return (
        <View className='bg-solar-blue-primary flex-1'>
            <ScreenHeader
                title="Assinatura de documentos"
                subtitle="Documentos disponíveis para assinatura"
                classTitle='text-white text-2xl'
                classSubtitle='text-white text-base text-center'
            />
            <View className='p-4 bg-gray-100 rounded-t-3xl h-full gap-4'>
                <View className="flex-1 items-center justify-start bg-solar-gray-dark px-2">
                    <View className="flex-col items-center justify-center w-full px-2">
                        {assignDocs.length < 1 && (
                            <View className="py-2 px-4 rounded">
                                <Text className="text-lg text-solar-gray-light">
                                    No momento não há documentos a serem assinados
                                </Text>
                            </View>
                        )}
                        {assignDocs &&
                            assignDocs.map((doc: any, idx: number) => (
                                <View
                                    key={idx}
                                    className="w-full bg-gray-50 rounded-md shadow-md shadow-black p-2 mb-3"
                                >
                                    <View className="flex-row items-center justify-between mb-2 bg-gray-100">
                                        <Text className="text-sm font-bold">
                                            Data: {doc.date}
                                        </Text>
                                        <Text className="text-sm font-bold">
                                            NF: {doc.number}
                                        </Text>
                                        <Text className="text-sm font-bold">
                                            Filial: {doc.origin}
                                        </Text>
                                        <Text className="text-sm font-bold">
                                            Série: {doc.serie}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="text-sm font-bold  text-solar-blue-dark">
                                            Documento: {doc.link}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center justify-end mt-2">
                                        <TouchableOpacity
                                            onPress={() =>
                                                router.push({
                                                    pathname: '/view-doc',
                                                    params: doc.link
                                                }
                                                )}
                                            className="bg-solar-orange-middle py-1 px-2 rounded"
                                        >
                                            <Text className="text-xs text-solar-blue-dark font-bold uppercase">
                                                Assinar documento
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                    </View>
                </View>
            </View>
        </View>
    );
};

export default DocsAssign;
