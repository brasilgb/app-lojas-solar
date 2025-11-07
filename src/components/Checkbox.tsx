import {Text, TouchableOpacity, View} from 'react-native';

import {cn} from '../lib/utils';

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof View> {
    label?: string;
    labelClasses?: string;
    checkboxClasses?: string;
    isSelected?: boolean;
    onValueChange?: (value: boolean) => void;
}
function Checkbox({
    label,
    labelClasses,
    checkboxClasses,
    className,
    isSelected,
    onValueChange,
    ...props
}: CheckboxProps) {
    const toggleCheckbox = () => {
        if (onValueChange) {
            onValueChange(!isSelected);
        }
    };

    return (
        <View
            className={cn('flex flex-row items-center gap-2', className)}
            {...props}
        >
            <TouchableOpacity onPress={toggleCheckbox}>
                <View
                    className={cn(
                        'w-4 h-4 border border-gray-700 rounded bg-background flex justify-center items-center',
                        {
                            'bg-foreground': isSelected,
                        },
                        checkboxClasses,
                    )}
                >
                    {isSelected && (
                        <Text className="text-background text-xs">✓</Text>
                    )}
                </View>
            </TouchableOpacity>
            {label && (
                <Text className={cn('text-primary', labelClasses)}>
                    {label}
                </Text>
            )}
        </View>
    );
}

export {Checkbox};
