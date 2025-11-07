import {Button} from '@/components/Button';
import {Input} from '@/components/Input';
import ScreenHeader from '@/components/ScreenHeader';
import {maskPhone} from '@/lib/mask';
import {router, useLocalSearchParams} from 'expo-router';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {View} from 'react-native';

interface FormProps {
    motivo: string;
    emailCliente: string;
    celularCliente: string;
}

const DataExclude = () => {
    const params = useLocalSearchParams();

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: {errors},
    } = useForm<FormProps>({
        defaultValues: {
            motivo: '',
            emailCliente: '',
            celularCliente: '',
        },
    });

    useEffect(() => {
        if (params.emailCliente || params.celularCliente) {
            setValue('emailCliente', params.emailCliente as string);
            setValue('celularCliente', params.celularCliente as string);
        }
    }, [params, setValue]);

    const onSubmit = (data: FormProps) => {
        reset();
        router.replace({
            pathname: '/data-analise',
            params: {emailCliente: data.emailCliente},
        });
    };

    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Exclusão de dados"
                subtitle="Preencha o formuário para iniciarmos o processo de exclusão de dados"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <View className="flex-1 bg-white px-4 rounded-t-3xl">
                <View className="flex-1 p-2">
                    <View className="flex-col gap-4 my-4 w-full">
                        <Controller
                            control={control}
                            name="motivo"
                            render={({field: {onChange, onBlur, value}}) => (
                                <View>
                                    <Input
                                        label="Motivo para a exclusão"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        multiline
                                        numberOfLines={4}
                                        textAlignVertical="top"
                                        inputClasses="h-36"
                                    />
                                </View>
                            )}
                        />
                    </View>

                    <View className="flex-col gap-4 my-4 w-full">
                        <Controller
                            control={control}
                            name="emailCliente"
                            render={({field: {onChange, onBlur, value}}) => (
                                <View>
                                    <Input
                                        label="E-mail do cliente"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        readOnly
                                        inputClasses="!text-gray-800"
                                        labelClasses=""
                                    />
                                </View>
                            )}
                        />
                    </View>

                    <View className="flex-col gap-4 my-4 w-full">
                        <Controller
                            control={control}
                            name="celularCliente"
                            render={({field: {onChange, onBlur, value}}) => (
                                <View>
                                    <Input
                                        label="Celular do cliente"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value ? maskPhone(value) : ''}
                                        readOnly
                                    />
                                </View>
                            )}
                        />
                    </View>
                </View>
                <View className="p-2 py-4 bg-white">
                    <Button
                        label={'Continuar'}
                        variant={'secondary'}
                        size={'lg'}
                        onPress={handleSubmit(onSubmit)}
                    />
                </View>
            </View>
        </View>
    );
};
export default DataExclude;
