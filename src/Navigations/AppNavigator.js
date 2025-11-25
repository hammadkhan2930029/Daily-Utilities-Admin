// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import BottomTabNavigator from './BottomTabsNavigator';

// export default function AppNavigator() {
//   return (

//     <NavigationContainer>
//       <BottomTabNavigator/>
//     </NavigationContainer>
//   );
// }

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigation';
import BottomTabNavigator from './BottomTabsNavigator';
import { Splash } from '../Screens/splash';
import auth from '@react-native-firebase/auth';
import { EditData } from '../Screens/editData';

const RootStack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); //false
  useEffect(() => {
    const unsubsCribe = auth().onAuthStateChanged(user => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false); //false
      }
      setIsLoading(false);
    });
    return () => unsubsCribe();
  }, []);
  console.log('is loggin :', isLoggedIn);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          <RootStack.Screen name="Splash" component={Splash} />
        ) : isLoggedIn ? (
          <>
            <RootStack.Screen name="MainApp" component={BottomTabNavigator} />
            <RootStack.Screen name="EditData" component={EditData} />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
