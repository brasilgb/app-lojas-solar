import AppLoading from '@/components/app-loading';
import {Button} from '@/components/Button';
import ScreenHeader from '@/components/ScreenHeader';
import {useAuthContext} from '@/contexts/AppContext';
import serviceapp from '@/services/serviceapp';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useEffect, useState} from 'react';
import {
    Alert,
    Image,
    Modal,
    Platform,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const LoadImages = () => {
    const {disconnect} = useAuthContext();
    const params = useLocalSearchParams();
    const dataToken = params as any;
    const [imageType, setImageType] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [imageSelfie, setImageSelfie] = useState<any>('');
    const [imageDocument, setImageDocument] = useState<any>('');
    const [imageAssignature, setImageAssignature] = useState<any>('');
    const [imageAddress, setImageAddress] = useState<any>('');
    const [imageFinance, setImageFinance] = useState<any>('');

    const getPermission = async () => {
        const {granted} = await ImagePicker.requestCameraPermissionsAsync();

        if (!granted) {
            alert('Você precisa dar permissão!');
        }
    };

    const getImageUpload = async (type: any) => {
        if (type === 'camera') {
            setTimeout(async () => {
                const result = await ImagePicker.launchCameraAsync({
                    base64: true,
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 1,
                });
                setImagesUpload(result);
            }, 900);
        }

        if (type === 'gallery') {
            const result = await ImagePicker.launchImageLibraryAsync({
                base64: true,
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            setImagesUpload(result);
        }
    };
    const setImagesUpload = (result: any) => {
        if (!result.canceled) {
            let image;
            switch (imageType) {
                case 'selfCliente':
                    image = [
                        setImageSelfie(result.assets[0].uri),
                        storageDocs({
                            key: 'selfCliente',
                            imageName: result.assets[0].uri,
                            base64: result.assets[0].base64,
                        }),
                    ];
                    break;
                case 'imaDocumento':
                    image = [
                        setImageDocument(result.assets[0].uri),
                        storageDocs({
                            key: 'imaDocumento',
                            imageName: result.assets[0].uri,
                            base64: result.assets[0].base64,
                        }),
                    ];
                    break;
                case 'imaAssinatura':
                    image = [
                        setImageAssignature(result.assets[0].uri),
                        storageDocs({
                            key: 'imaAssinatura',
                            imageName: result.assets[0].uri,
                            base64: result.assets[0].base64,
                        }),
                    ];
                    break;
                case 'imaEndereco':
                    image = [
                        setImageAddress(result.assets[0].uri),
                        storageDocs({
                            key: 'imaEndereco',
                            imageName: result.assets[0].uri,
                            base64: result.assets[0].base64,
                        }),
                    ];
                    break;
                case 'imaRenda':
                    image = [
                        setImageFinance(result.assets[0].uri),
                        storageDocs({
                            key: 'imaRenda',
                            imageName: result.assets[0].uri,
                            base64: result.assets[0].base64,
                        }),
                    ];
                    break;
            }
            return image;
        }
    };

    useEffect(() => {
        getPermission();
    }, []);

    // Armazena usuário no storage
    const storageImages = async (data: any) => {
        let numberImage = [];
        try {
            const storeImage = await AsyncStorage.getItem('StoreImg');
            if (storeImage !== null) {
                numberImage = JSON.parse(storeImage);
            }
            numberImage = numberImage.filter((ki: any) => ki.key !== data.key);
            numberImage.push(data);
            await AsyncStorage.setItem('StoreImg', JSON.stringify(numberImage));
        } catch (error) {
            console.log(error);
        }
    };

    const contentUpload = [
        {
            Description: 'Tire uma selfie',
            ImaDoc: 'selfCliente',
            Icon: require('@/assets/images/docs/selfie.png'),
        },
        {
            Description: 'Tire uma foto do RG ou CNH',
            ImaDoc: 'imaDocumento',
            Icon: require('@/assets/images/docs/document.png'),
        },
        {
            Description: 'Tire uma foto da sua assinatura',
            ImaDoc: 'imaAssinatura',
            Icon: require('@/assets/images/docs/signature.png'),
        },
        {
            Description: 'Tire uma foto do seu comprovante de residência',
            ImaDoc: 'imaEndereco',
            Icon: require('@/assets/images/docs/address.png'),
        },
        {
            Description: 'Tire uma foto do seu comprovante de renda',
            ImaDoc: 'imaRenda',
            Icon: require('@/assets/images/docs/voucher.png'),
        },
    ];

    useEffect(() => {
        async function loadStorage() {
            // await AsyncStorage.clear();
            // setImageStore([])
            const storageImage = await AsyncStorage.getItem('StoreImg');
            if (storageImage) {
                let images = JSON.parse(storageImage);
                setImageSelfie(
                    images
                        .filter((fi: any) => fi.key === 'selfCliente')
                        .map((im: any) => im.imageName)[0],
                );
                setImageDocument(
                    images
                        .filter((fi: any) => fi.key === 'imaDocumento')
                        .map((im: any) => im.imageName)[0],
                );
                setImageAssignature(
                    images
                        .filter((fi: any) => fi.key === 'imaAssinatura')
                        .map((im: any) => im.imageName)[0],
                );
                setImageAddress(
                    images
                        .filter((fi: any) => fi.key === 'imaEndereco')
                        .map((im: any) => im.imageName)[0],
                );
                setImageFinance(
                    images
                        .filter((fi: any) => fi.key === 'imaRenda')
                        .map((im: any) => im.imageName)[0],
                );
            }
        }
        loadStorage();
    });

    async function storageDocs({key, imageName, base64}: any) {
        storageImages({key: key, imageName: imageName});
        setLoading(true);
        await serviceapp
            .post(`(WS_IMAGENS_CLIENTE)`, {
                token: dataToken,
                selfCliente: key == 'selfCliente' ? base64 : '',
                Documento: key == 'imaDocumento' ? base64 : '',
                Assinatura: key == 'imaAssinatura' ? base64 : '',
                Endereco: key == 'imaEndereco' ? base64 : '',
                Renda: key == 'imaRenda' ? base64 : '',
            })
            .then(response => {
                const {success, message, token} = response.data.resposta;
                setLoading(false);

                if (success) {
                    Alert.alert('Sucesso', 'Imagem enviada com sucesso');
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    if (loading) {
        return <AppLoading />;
    }

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View
                    className="flex-1 items-center justify-end bg-[#0000007b]"
                    onTouchEnd={() => setModalVisible(false)}
                >
                    <View className="bg-[#f1f1f1eb] w-full rounded-t-3xl border border-white pb-8">
                        <Text className="text-xl py-2 text-center">
                            Selecione a fonte
                        </Text>
                        <View className="border-b border-gray-300 mb-4 mx-4" />
                        <View
                            className={`flex-row items-center justify-around ${
                                Platform.OS === 'ios' ? 'pb-8' : 'pb-6'
                            }`}
                        >
                            <TouchableOpacity
                                className="flex-col items-center p-2 bg-solar-gray-dark rounded-lg"
                                onPress={() => getImageUpload('camera')}
                            >
                                <Ionicons
                                    name="camera"
                                    size={45}
                                    color="#024D9F"
                                />
                                <Text className="text-xs">Câmera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-col items-center p-2 bg-solar-gray-dark rounded-lg"
                                onPress={() => getImageUpload('gallery')}
                            >
                                <Ionicons
                                    name="image"
                                    size={45}
                                    color="#024D9F"
                                />
                                <Text className="text-xs">Galeria</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View className="bg-solar-blue-primary flex-1">
                <ScreenHeader
                    title="Enviar Documentos"
                    subtitle="Enviar uma selfie e uma foto dos documentos"
                    classTitle="text-white text-2xl"
                    classSubtitle="text-white text-base text-center"
                />
                <View className="p-3 bg-white rounded-t-3xl flex-1">
                    <View className="flex-1">
                        <Pressable
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                setImageType('selfCliente');
                            }}
                        >
                            <View
                                className={`flex-row items-center justify-between py-3 pl-2 text-sm font-medium text-gray-500 border-b border-gray-300`}
                            >
                                <View className="w-[80%]">
                                    <Text className="text-base font-PoppinsMedium">
                                        {contentUpload[0].Description}
                                    </Text>
                                </View>
                                <View className="">
                                    {imageSelfie ? (
                                        <Image
                                            className="w-12 h-12"
                                            source={{uri: imageSelfie}}
                                        />
                                    ) : (
                                        <Image
                                            className="w-12 h-12"
                                            source={contentUpload[0].Icon}
                                        />
                                    )}
                                </View>
                            </View>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                setImageType('imaDocumento');
                            }}
                        >
                            <View
                                className={`flex-row items-center justify-between py-3 pl-2 text-sm font-medium text-gray-500 border-b border-gray-300`}
                            >
                                <View className="w-[80%]">
                                    <Text className="text-base font-PoppinsMedium">
                                        {contentUpload[1].Description}
                                    </Text>
                                </View>
                                <View className="">
                                    {imageDocument ? (
                                        <Image
                                            className="w-12 h-12"
                                            source={{
                                                uri: imageDocument,
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            className="w-12 h-12"
                                            source={contentUpload[1].Icon}
                                        />
                                    )}
                                </View>
                            </View>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                setImageType('imaAssinatura');
                            }}
                        >
                            <View
                                className={`flex-row items-center justify-between py-3 pl-2 text-sm font-medium text-gray-500 border-b border-gray-300`}
                            >
                                <View className="w-[80%]">
                                    <Text className="text-base font-PoppinsMedium">
                                        {contentUpload[2].Description}
                                    </Text>
                                </View>
                                <View className="">
                                    {imageAssignature ? (
                                        <Image
                                            className="w-12 h-12"
                                            source={{
                                                uri: imageAssignature,
                                            }}
                                        />
                                    ) : (
                                        <Image
                                            className="w-12 h-12"
                                            source={contentUpload[2].Icon}
                                        />
                                    )}
                                </View>
                            </View>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                setImageType('imaEndereco');
                            }}
                        >
                            <View
                                className={`flex-row items-center justify-between py-3 pl-2 text-sm font-medium text-gray-500 border-b border-gray-300`}
                            >
                                <View className="w-[80%]">
                                    <Text className="text-base font-PoppinsMedium">
                                        {contentUpload[3].Description}
                                    </Text>
                                </View>
                                <View className="">
                                    {imageAddress ? (
                                        <Image
                                            className="w-12 h-12"
                                            source={{uri: imageAddress}}
                                        />
                                    ) : (
                                        <Image
                                            className="w-12 h-12"
                                            source={contentUpload[3].Icon}
                                        />
                                    )}
                                </View>
                            </View>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                setImageType('imaRenda');
                            }}
                        >
                            <View
                                className={`flex-row items-center justify-between py-3 pl-2 text-sm font-medium text-gray-500 border-b border-gray-300`}
                            >
                                <View className="w-[80%]">
                                    <Text className="text-base font-PoppinsMedium">
                                        {contentUpload[4].Description}
                                    </Text>
                                </View>
                                <View className="">
                                    {imageFinance ? (
                                        <Image
                                            className="w-12 h-12"
                                            source={{uri: imageFinance}}
                                        />
                                    ) : (
                                        <Image
                                            className="w-12 h-12"
                                            source={contentUpload[4].Icon}
                                        />
                                    )}
                                </View>
                            </View>
                        </Pressable>
                    </View>
                    <Button
                        label="Continuar"
                        size={'default'}
                        variant={'secondary'}
                        onPress={() => router.push('/images-sent')}
                        disabled={
                            imageSelfie &&
                            imageDocument &&
                            imageAssignature &&
                            imageAddress &&
                            imageFinance
                                ? false
                                : true
                        }
                    />
                </View>
            </View>
        </>
    );
};

export default LoadImages;
