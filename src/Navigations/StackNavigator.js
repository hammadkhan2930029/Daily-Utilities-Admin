import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GoldPriceHistory } from '../Screens/DetailsScreen';
import { Main } from '../Screens/main';



const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>


      <Stack.Screen name="main" component={Main} />
      <Stack.Screen name="Details" component={GoldPriceHistory} />





    </Stack.Navigator>
  );
}
