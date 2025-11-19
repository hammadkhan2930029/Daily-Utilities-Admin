import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ProfileScreen } from "../Screens/ProfileScreen";
import { SettingsScreen } from "../Screens/SettingsScreen";
import StackNavigator from "./StackNavigator";
import Ionicons from "react-native-vector-icons/Ionicons";
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { History } from "../Screens/history";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// import AuthNavigator from "./AuthNavigation";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size, color }) => {
          let iconName;

          if (route.name === "HomeStack") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person";
          } else if (route.name === "Settings") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          }
          else if (route.name === "history") {
            iconName = focused ? "history" : "history";
          }

          return <MaterialIcons name={iconName} size={22} color={color} />;
        },
        tabBarInactiveTintColor: "#ADADC9",
        tabBarActiveTintColor: "#000000",
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
         
          position: "absolute",
          bottom: 10,      
          left: 20,         
          right: 20,        
          elevation: 5,
          backgroundColor: "#fff",
          borderRadius: 50, 
          height: 70,
          justifyContent: "center",
          alignItems: "center",
          // paddingTop:15
        },
       tabBarItemStyle:{
        marginTop:responsiveHeight(2)

       }
      })}
    >
      <Tab.Screen
        name="HomeStack"
        component={StackNavigator}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="history" component={History} options={{ headerShown: false }} />

      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      {/* <Tab.Screen name="authNavigator" component={AuthNavigator} options={{ headerShown: false }} /> */}

      


    </Tab.Navigator>
  );
}
