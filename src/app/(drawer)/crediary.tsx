import React, { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import ScreenHeader from '@/components/ScreenHeader'
import { ScrollView, View, Text, KeyboardAvoidingView, Platform } from 'react-native'
import { Input } from '@/components/Input'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CrediaryFormType, CrediarySchema } from '@/schema/app'
import AppLoading from '@/components/app-loading'

const Crediary = () => {
  const { bottom } = useSafeAreaInsets();
  const [loading, setLoading] = useState<boolean>(false);
  // const { loading, setLoading } = useAuthContext();

  useEffect(() => {
    const getCustomers = async () => {
      // setLoading(true)
    };
    getCustomers();
  }, []);

  const { control, handleSubmit, formState: { errors } } = useForm<CrediaryFormType>({
    defaultValues: {},
    resolver: zodResolver(CrediarySchema)
  });

  const onSubmit: SubmitHandler<CrediaryFormType> = (data: CrediaryFormType) => {
    console.log(data);
  }

  if (loading) {
    return <AppLoading />
  }

  return (
    <View className='bg-white flex-1'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
        className='bg-solar-blue-primary'
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingBottom: bottom }}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <ScreenHeader title="Crediário" subtitle="Preencha corretamente o formulário" classTitle='text-white text-2xl' classSubtitle='text-white text-lg text-center' />
            {loading && <AppLoading />}
            <View className='p-4 bg-white rounded-t-3xl'>
              <View className='flex-col gap-4 my-4'>

                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value }
                  }) => (
                    <View>
                      <Input
                        label='Nome da Mãe'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        inputClasses={`${errors.nomeMae ? '!border-solar-red-primary' : ''}`}
                      />
                    </View>
                  )}
                  name='nomeMae'
                />
                {errors.nomeMae && (
                  <Text className='text-solar-red-primary -mt-4'>{errors.nomeMae?.message}</Text>
                )}

                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value }
                  }) => (
                    <View>
                      <Input
                        label='Gênero'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        inputClasses={`${errors.sexo ? '!border-solar-red-primary' : ''}`}
                      />
                    </View>
                  )}
                  name='sexo'
                />
                {errors.sexo && (
                  <Text className='text-solar-red-primary -mt-4'>{errors.sexo?.message}</Text>
                )}

                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value }
                  }) => (
                    <View>
                      <Input
                        label='Escolaridade'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        inputClasses={`${errors.escolaridade ? '!border-solar-red-primary' : ''}`}
                      />
                    </View>
                  )}
                  name='escolaridade'
                />
                {errors.escolaridade && (
                  <Text className='text-solar-red-primary -mt-4'>{errors.escolaridade?.message}</Text>
                )}

                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value }
                  }) => (
                    <View>
                      <Input
                        label='Local de trabalho'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        inputClasses={`${errors.localTrabalho ? '!border-solar-red-primary' : ''}`}
                      />
                    </View>
                  )}
                  name='localTrabalho'
                />
                {errors.localTrabalho && (
                  <Text className='text-solar-red-primary -mt-4'>{errors.localTrabalho?.message}</Text>
                )}

                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value }
                  }) => (
                    <View>
                      <Input
                        label='Estado civil'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        inputClasses={`${errors.estadoCivil ? '!border-solar-red-primary' : ''}`}
                      />
                    </View>
                  )}
                  name='estadoCivil'
                />
                {errors.estadoCivil && (
                  <Text className='text-solar-red-primary -mt-4'>{errors.estadoCivil?.message}</Text>
                )}

                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value }
                  }) => (
                    <View>
                      <Input
                        label='Nome do cônjuge'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        inputClasses={`${errors.nomeConjuge ? '!border-solar-red-primary' : ''}`}
                      />
                    </View>
                  )}
                  name='nomeConjuge'
                />
                {errors.nomeConjuge && (
                  <Text className='text-solar-red-primary -mt-4'>{errors.nomeConjuge?.message}</Text>
                )}

                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value }
                  }) => (
                    <View>
                      <Input
                        label='CPF do cônjuge'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        inputClasses={`${errors.cpfConjuge ? '!border-solar-red-primary' : ''}`}
                      />
                    </View>
                  )}
                  name='cpfConjuge'
                />
                {errors.cpfConjuge && (
                  <Text className='text-solar-red-primary -mt-4'>{errors.cpfConjuge?.message}</Text>
                )}

                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value }
                  }) => (
                    <View>
                      <Input
                        label='Profissão'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        inputClasses={`${errors.profissao ? '!border-solar-red-primary' : ''}`}
                      />
                    </View>
                  )}
                  name='profissao'
                />
                {errors.profissao && (
                  <Text className='text-solar-red-primary -mt-4'>{errors.profissao?.message}</Text>
                )}

                <Controller
                  control={control}
                  render={({
                    field: { onChange, onBlur, value }
                  }) => (
                    <View>
                      <Input
                        label='Renda'
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        inputClasses={`${errors.renda ? '!border-solar-red-primary' : ''}`}
                      />
                    </View>
                  )}
                  name='renda'
                />
                {errors.renda && (
                  <Text className='text-solar-red-primary -mt-4'>{errors.renda?.message}</Text>
                )}

              </View>

              <Button
                label={'Cadastrar'}
                variant={'secondary'}
                size={'lg'}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default Crediary