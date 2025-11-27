import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import serviceapp from '@/services/serviceapp';
import AppLoading from '../app-loading';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../accordion';

const Crediario = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [crediarios, setCrediarios] = useState<any>([]);
    const [idFaq, setIdFaq] = useState(null);

    const handleOpenFaq = (idx: any) => {
        setIdFaq(idx);
    };

    useEffect(() => {
        const getCrediarios = async () => {
            setLoading(true);
            await serviceapp
                .get('(WS_CARREGA_FAQ)')
                .then(response => {
                    setLoading(false);
                    const result =
                        response.data.resposta.data.categorias.filter(
                            (c: any) =>
                                c.Categoria.xCategoria.trim() === 'Crediário',
                        );
                    const resp = result.map(
                        (cat: any, index: any) => cat.Categoria,
                    );
                    setCrediarios(resp);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        getCrediarios();
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
                key={'crediario'}
            >
                 {crediarios.map((crediario: any) =>
                    crediario.perguntas
                        .filter((com: any) => com.resposta != '')
                        .map((per: any, idx: any) => (
                            <AccordionItem id={`${idx}`} key={`${idx}`}  className={`${idx === crediario.perguntas.length - 1 ? 'border-0' : 'border-gray-200'} pr-6`}>
                                <AccordionTrigger textClassName='text-sm px-2 w-full'>{per.pergunta}</AccordionTrigger>
                                <AccordionContent contentClassName='px-2'>{per?.resposta}</AccordionContent>
                            </AccordionItem>
                        )),
                )}
            </Accordion>
        </View>
    );
};

export default Crediario;
