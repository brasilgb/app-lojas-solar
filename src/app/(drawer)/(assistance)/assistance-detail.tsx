import { Card, CardHeader } from '@/components/Card';
import ScreenHeader from '@/components/ScreenHeader';
import { useAuthContext } from '@/contexts/AppContext';
import serviceapp from '@/services/serviceapp';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const AssistanceDetail = () => {
    const { user, disconnect } = useAuthContext();
    const [loading, setLoading] = useState<boolean>(false);
    const params = useLocalSearchParams();
    const dataAssistance = params as any;

    const [details, setDetails] = useState<any>([]);

    useEffect(() => {
        const getDetails = async () => {
            setLoading(true);
            await serviceapp
                .get(
                    `(WS_PROTOCOLO_DETALHE)?token=${user?.token}&filial=${dataAssistance.filial}&nProtocolo=${dataAssistance.nProtocolo}`,
                )
                .then(response => {
                    const { token, message, data } = response.data.resposta;

                    setDetails(data);
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        getDetails();
    }, [dataAssistance, user]);

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Detalhes da Assistência"
                subtitle={dataAssistance?.produto}
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className="p-2 bg-white rounded-t-3xl h-full">
                <Card className="border border-white rounded-lg mb-2 bg-gray-50 p-2 shadow-md shadow-black m-2">
                    <CardHeader className="mb-4 gap-2">
                        <Text className="text-xl font-bold text-gray-700">
                            Abertura:{' '}
                            <Text className="font-normal text-gray-500">
                                {details.Abertura}
                            </Text>
                        </Text>
                        <Text className="text-xl font-bold text-gray-700">
                            Defeito:{' '}
                            <Text className="font-normal text-gray-500">
                                {details.defeito}
                            </Text>
                        </Text>
                        <Text className="text-xl font-bold text-gray-700">
                            Status:{' '}
                            <Text className="font-normal text-gray-500">
                                {details.status}
                            </Text>
                        </Text>
                    </CardHeader>
                </Card>
                <Card className="border border-white rounded-lg mb-2 bg-gray-50 p-2 shadow-md shadow-black m-2">
                    <View
                        className={`flex-row items-start justify-between bg-solar-gray-light my-1  p-4 mb-4`}
                    >
                        <View className="relative border-l-2 border-gray-200">
                            {details.eventos &&
                                details.eventos.map(
                                    (e: any, i: number, row: any) => (
                                        <View
                                            key={i}
                                            className={`flex-col items-left ${i + 1 === row.length
                                                    ? ''
                                                    : 'mb-8'
                                                } ml-4`}
                                        >
                                            <View
                                                className={`absolute w-6 h-6 rounded-full top-0 -left-7 ${i + 1 === row.length
                                                        ? 'bg-solar-orange-primary'
                                                        : 'bg-gray-400'
                                                    } border-2 border-gray-200`}
                                            />
                                            <Text className="text-sm font-medium text-solar-blue-secondary ml-2">
                                                {e?.xEventos}
                                            </Text>
                                        </View>
                                    ),
                                )}
                        </View>
                    </View>
                </Card>
            </View>
        </View>
    );
};

export default AssistanceDetail;
