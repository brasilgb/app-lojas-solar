import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {CalendarDaysIcon} from 'lucide-react-native';
import moment from 'moment';
import React, {useState} from 'react';
import {Text, View} from 'react-native';
import {Button} from './Button';

interface AppDateTimePickerProps {
    value: Date;
    onChange: (date: Date) => void;
}

const AppDateTimePicker = ({
    value,
    onChange: onValueChange,
}: AppDateTimePickerProps) => {
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState(false);

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        setShow(false);
        if (event.type === 'set' && selectedDate) {
            onValueChange(selectedDate);
        }
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    return (
        <>
            <View className="flex-row items-center gap-4 p-2 bg-white rounded-lg shadow shadow-black">
                <Text className="text-lg text-solar-blue-secondary">
                    {moment(value).format('DD/MM/YYYY')}
                </Text>
                <Button
                    variant={'default'}
                    size={'icon'}
                    onPress={showDatepicker}
                    label={<CalendarDaysIcon size={24} color={'white'} />}
                    labelClasses="p-0.5"
                />
            </View>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={value}
                    maximumDate={new Date()}
                    mode={mode}
                    is24Hour={true}
                    onChange={onChange}
                    locale="pt"
                />
            )}
        </>
    );
};

export default AppDateTimePicker;
