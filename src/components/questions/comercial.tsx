import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import serviceapp from '@/services/serviceapp';
import AppLoading from '../app-loading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../accordion';

const Comercial = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [comerciais, setComerciais] = useState<any>([]);
    const [idFaq, setIdFaq] = useState(null);

    const handleOpenFaq = (idx: any) => {
        setIdFaq(idx);
    };

    useEffect(() => {
        const getComerciais = async () => {
            setLoading(true);
            await serviceapp
                .get('(WS_CARREGA_FAQ)')
                .then(response => {
                    setLoading(false);
                    const result =
                        response.data.resposta.data.categorias.filter(
                            (c: any) =>
                                c.Categoria.xCategoria.trim() === 'Comercial',
                        );
                    const resp = result.map((cat: any) => cat.Categoria);
                    setComerciais(resp);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getComerciais();
    }, []);

    if (loading) {
        return <AppLoading />
    }

    return (
        <View className="bg-white rounded-xl">
            <Accordion
                type="single"
                collapsible
                mode={'light'} // 'light' or 'dark' based on system preference
            >
                {comerciais.map((comercial: any) =>
                    comercial.perguntas
                        .filter((com: any) => com.resposta != '')
                        .map((per: any, idx: any) => (
                            <AccordionItem key={`${idx}`} id={`${idx}`} className={`${idx === comerciais.length + 1 ? 'border-0' : 'border-gray-200'}`}>
                                <AccordionTrigger textClassName='text-sm px-2'>{per?.pergunta}</AccordionTrigger>
                                <AccordionContent contentClassName='px-2'>{per?.resposta}</AccordionContent>
                            </AccordionItem>
                        )),
                )}
            </Accordion>
        </View>
    );
};

export default Comercial;
