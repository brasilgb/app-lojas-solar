import {Button} from '@/components/Button';
import {Card} from '@/components/Card';
import ScreenHeader from '@/components/ScreenHeader';
import {Switch} from '@/components/Switch';
import {useAuthContext} from '@/contexts/AppContext';
import serviceapp from '@/services/serviceapp';
import React, {useEffect, useState} from 'react';
import {Alert, Text, View} from 'react-native';

const PrivacySettings = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const {user, disconnect} = useAuthContext();
    const [isNotification, setIsNotification] = useState(false);
    const [isEmail, setIsEmail] = useState(false);
    const [autorizaCliente, setAutorizaCliente] = useState<any>([]);

    const toggleNotify = () => {
        setIsNotification(previousState => !previousState);
    };
    const toggleEmail = () => {
        setIsEmail(previousState => !previousState);
    };

    useEffect(() => {
        const getAutorizaCliente = async () => {
            setLoading(true);
            await serviceapp
                .get(`(WS_AUTORIZA_CLIENTE)?token=${user?.token}`)
                .then(response => {
                    const {token, message, data} = response.data.resposta;
                    setLoading(false);

                    setAutorizaCliente(data?.pergunta);
                    setIsNotification(
                        data?.pergunta[0]?.resposta === 'S' ? true : false,
                    );
                    setIsEmail(
                        data?.pergunta[1]?.resposta === 'S' ? true : false,
                    );
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getAutorizaCliente();
    }, [user]);

    const handleSubmitPrivacity = async () => {
        setLoading(true);
        const response = await serviceapp.get(
            `(WS_RESPOSTA_AUTORIZA)?
      token=${user?.token}&
      resposta1=${isNotification ? 'S' : 'N'}
      &resposta2=${isEmail ? 'S' : 'N'}`,
        );
        const {success, message} = response.data.resposta;
        setLoading(false);
        Alert.alert('Atenção', 'Atualização de dados concluída com sucesso', [
            {text: 'Ok'},
        ]);
    };

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Privacidade"
                subtitle="Suas configurações de privacidade podem ser alteradas abaixo"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className="flex-1 p-4 bg-gray-100 rounded-t-3xl h-full gap-4">
                <View className="flex-1">
                    <Card className="flex-row items-center justify-between my-1 px-2 rounded-xl text-lg leading-6 font-medium bg-white border border-gray-300 shadow-sm shadow-gray-200 py-4">
                        <View className="p-4 w-4/5">
                            <Text className="text-lg font-medium text-solar-blue-secondary">
                                {autorizaCliente && autorizaCliente[0]?.texto}
                            </Text>
                        </View>
                        <View>
                            <Switch
                                onValueChange={toggleNotify}
                                value={isNotification}
                            />
                        </View>
                    </Card>
                    <Card className="flex-row items-center justify-between my-1 px-2 rounded-xl text-lg leading-6 font-medium bg-white border border-gray-300 shadow-sm shadow-gray-200 py-4">
                        <View className="p-4 w-4/5">
                            <Text className="text-lg font-medium text-solar-blue-secondary">
                                {autorizaCliente && autorizaCliente[1]?.texto}
                            </Text>
                        </View>
                        <View>
                            <Switch
                                onValueChange={toggleEmail}
                                value={isEmail}
                            />
                        </View>
                    </Card>
                </View>
                <View>
                    <Button
                        label={'Concluir'}
                        variant={'secondary'}
                        onPress={handleSubmitPrivacity}
                    />
                </View>
            </View>
        </View>
    );
};

export default PrivacySettings;
