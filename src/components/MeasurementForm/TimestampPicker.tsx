import React, { useState } from "react";
import { View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker';


interface TimestampPickerProps {
  value?: Date;
  onTimestampChange?: (timestamp: Date) => void;
}

export default function TimestampPicker({
  value,
  onTimestampChange,
}: TimestampPickerProps) {

  const [date, setDate] = useState(new Date());
  
  const onChange = (event: any, selectedDate: Date | undefined) => {
    
    const currentDate = selectedDate || date;
    setDate(currentDate);

    onTimestampChange && onTimestampChange(currentDate);
  };

  return(
    <View style={{paddingHorizontal: 12}}>
      <DateTimePicker style={{}}
        testID="dateTimePicker"
        value={value || date}
        mode={"date"}
        is24Hour={true}
        display="default"
        onChange={onChange}
      />
  </View>
  )
};