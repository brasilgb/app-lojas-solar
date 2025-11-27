import StackHeader from '@/components/StackHeader';
import {Stack} from 'expo-router';

const PaymentLayout = () => {
    return (
        <Stack
            screenOptions={{
                animation: 'fade',
            }}
        >
            <Stack.Screen
                name="payment"
                options={{
                    header: () => <StackHeader drawer />,
                    headerShown: true,
                    title: 'Pagamentos',
                }}
            />

            <Stack.Screen
                name="methods"
                options={{
                    header: () => <StackHeader back close="/payment" />,
                    headerShown: true,
                    title: 'Metordos de Pagamentos',
                }}
            />

            <Stack.Screen
                name="pixpayment"
                options={{
                    header: () => <StackHeader close="/payment" />,
                    headerShown: true,
                    title: 'Pagamento pix',
                }}
            />

            <Stack.Screen
                name="cartpayment"
                options={{
                    header: () => <StackHeader back close="/payment" />,
                    headerShown: true,
                    title: 'Pagamento crédito',
                }}
            />

            <Stack.Screen
                name="cardbillpaid"
                options={{
                    header: () => <StackHeader close="/payment" />,
                    headerShown: true,
                    title: 'Pagamento crédito',
                }}
            />
        </Stack>
    );
};

export default PaymentLayout;
