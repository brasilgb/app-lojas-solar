import StackHeader from "@/components/StackHeader";
import { Stack } from "expo-router";

const PaymentLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='payment'
                options={{
                    header: () => <StackHeader drawer />,
                    headerShown: true,
                    title: 'Lojas solar próximas',
                }}
            />
        </Stack>
    );
};

export default PaymentLayout;