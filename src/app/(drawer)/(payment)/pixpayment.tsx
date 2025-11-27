import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Share, Text, View } from 'react-native';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/Card';
import ScreenHeader from '@/components/ScreenHeader';
import { useAuthContext } from '@/contexts/AppContext';
import { maskMoney } from '@/lib/mask';
import serviceapp from '@/services/serviceapp';
import * as Clipboard from 'expo-clipboard';
import { CopyIcon, Share2Icon } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';

const PixPayment = () => {
    const {user} = useAuthContext();
    const params = useLocalSearchParams();
    const valueOrder = params.valueOrder;
    const mtoken = user?.token;

    const [pixOperations, setPixOpertions] = useState<string>('');

    useEffect(() => {
        const getPayPix = async () => {
            const response = await serviceapp.get(
                `(WS_TRANSACAO_PIX)?token=${mtoken}&tempoPix=3600&valorPix=${valueOrder}&mensagemPix=Pagamento Pix Grupo Solar`,
            );
            const {success, message, txid, banco, copiaColaPix} =
                response.data.resposta;
            if (success) {
                let dataPay = {
                    idTransacao: txid,
                    urlBoleto: banco,
                };
                sendOrderAtualize(valueOrder, dataPay);
                setPixOpertions(copiaColaPix);
            } else {
                Alert.alert('Atenção no pay pix', message, [{text: 'Ok'}]);
                return;
            }
        };
        getPayPix();
    }, [mtoken]);

    const sharingUrl = async () => {
        try {
            const result = await Share.share({
                message: `${pixOperations}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    const fetchCopiedUrl = async () => {
        Clipboard.setStringAsync(`${pixOperations}`);
    };

    const sendOrderAtualize = async (dataPix: any, dataPay: any) => {
        let orderResponse = {
            numeroOrdem: dataPix.numeroOrdem,
            statusOrdem: 12,
            idTransacao: dataPay.idTransacao,
            tipoPagamento: 4,
            urlBoleto: String(dataPay.urlBoleto),
        };

        const response = await serviceapp.get(
            `(WS_ATUALIZA_ORDEM)?token=91362590064312210014616&numeroOrdem=${orderResponse.numeroOrdem}&statusOrdem=${orderResponse.statusOrdem}&idTransacao=${orderResponse.idTransacao}&tipoPagamento=${orderResponse.tipoPagamento}&urlBoleto=${orderResponse.urlBoleto}`,
        );
        const {success} = response.data.resposta;
        console.log('pix pago ', success);
        return;
    };

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Pagamento"
                subtitle="Detalhes do pagamento PIX"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-lg text-center"
            />
            <View className="p-4 bg-white rounded-t-3xl flex-1">
                <Card className="items-center bg-white border-gray-300 shadow-sm shadow-slate-900">
                    <CardHeader>
                        <Text className="text-5xl font-extrabold text-solar-blue-secondary/80">
                            R${' '}
                            {maskMoney(
                                parseFloat(valueOrder as string).toFixed(2),
                            )}
                        </Text>
                    </CardHeader>
                    <CardTitle className="text-xl text-gray-500 font-normal pb-2">
                        Validade do QRCode 1h(uma hora)
                    </CardTitle>
                    <CardContent>
                        {pixOperations && (
                            <QRCode
                                value={pixOperations}
                                size={130}
                                logoBackgroundColor="transparent"
                            />
                        )}
                    </CardContent>
                    <CardFooter>
                        <Text className="text-center text-solar-blue-primary">
                            Use o leitor de QRCode para fazer a transação ou
                            escolha uma opção abaixo.
                        </Text>
                    </CardFooter>
                </Card>
                <View className="flex-row items-center justify-around gap-4 mt-8">
                    <Pressable onPress={fetchCopiedUrl}>
                        <Card className="items-center bg-white border-gray-300 shadow-sm shadow-slate-900 p-2">
                            <CardHeader>
                                <CopyIcon size={60} color={'#0d3b85d5'} />
                            </CardHeader>
                            <CardTitle className="text-base text-gray-500 font-normal">
                                PIX copia e cola
                            </CardTitle>
                        </Card>
                    </Pressable>
                    <Pressable onPress={sharingUrl}>
                        <Card className="items-center bg-white border-gray-300 shadow-sm shadow-slate-900 p-2">
                            <CardHeader>
                                <Share2Icon size={60} color={'#0d3b85d5'} />
                            </CardHeader>
                            <CardTitle className="text-base text-gray-500 font-normal">
                                Compartilhar PIX
                            </CardTitle>
                        </Card>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default PixPayment;
