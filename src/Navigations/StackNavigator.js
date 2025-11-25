import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoldPriceHistory } from '../Screens/DetailsScreen';
import { Main } from '../Screens/main';
// import { EditData } from '../Screens/editData';
import { History } from '../Screens/history';



const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>


      <Stack.Screen name="main" component={Main} />
      
      {/* <Stack.Screen name="EditData" component={EditData} /> */}
      <Stack.Screen name="Details" component={GoldPriceHistory} />






    </Stack.Navigator>
  );
}
