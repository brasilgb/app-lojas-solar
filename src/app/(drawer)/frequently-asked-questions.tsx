import ScreenHeader from '@/components/ScreenHeader';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/Tabs';
import Comercial from '@/components/questions/comercial';
import Crediario from '@/components/questions/crediario';
import React from 'react';
import {ScrollView, View} from 'react-native';

const FrequentlyAskedQuestions = () => {
    return (
        <View className="bg-solar-blue-primary flex-1">
            <ScreenHeader
                title="Perguntas Frequentes"
                subtitle="Elaboramos respostas para as dúvidas mais frequentes, selecione o assunto e confira"
                classTitle="text-white text-2xl"
                classSubtitle="text-white text-base text-center"
            />
            <ScrollView className="flex-1 bg-gray-100 rounded-t-3xl ">
                <View className="p-4 h-full gap-4">
                    <Tabs defaultValue="comercial">
                        <TabsList>
                            <TabsTrigger
                                id="comercial"
                                title="Comercial"
                                value={'comercial'}
                            />
                            <TabsTrigger
                                id="crediario"
                                title="Crediário"
                                value={'crediario'}
                            />
                        </TabsList>
                        <TabsContent value="comercial">
                            <Comercial />
                        </TabsContent>
                        <TabsContent value="crediario">
                            <Crediario />
                        </TabsContent>
                    </Tabs>
                </View>
            </ScrollView>
        </View>
    );
};

export default FrequentlyAskedQuestions;
