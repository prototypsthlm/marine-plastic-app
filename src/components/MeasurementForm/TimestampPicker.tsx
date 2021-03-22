import React, { useEffect, useState } from "react";
import { Button, Platform, Text, View } from 'react-native'
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
  const [show, setShow] = useState(false);

  useEffect(() => {
    if(Platform.OS === 'ios') setShow(true);
  }, [])
  
  const onChange = (event: any, selectedDate: Date | undefined) => {

    const currentDate = selectedDate || date;

    setShow(Platform.OS === 'ios');
    setDate(currentDate);

    onTimestampChange && onTimestampChange(currentDate);
  };

  const showDateTimePicker = () => {
    setShow(true);
  }

  return(
    <View style={{paddingHorizontal: 12}}>
      { Platform.OS !== 'ios' && (
        <>
        <View style={{ paddingVertical: 12}}>
          <Text>{date.toString()}</Text>
        </View>
        <Button onPress={showDateTimePicker} title="Change timestamp" />
        </>
       )}
      { show && (
        <DateTimePicker style={{}}
          testID="dateTimePicker"
          value={value || date}
          mode={"date"}
          display="default"
          onChange={onChange}
        />
      )}
  </View>
  )
};