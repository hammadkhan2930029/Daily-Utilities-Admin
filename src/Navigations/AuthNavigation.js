import Login from "../Screens/login";
import Register from "../Screens/register";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthStack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="login" component={Login} options={{ headerShown: false }} />
      <AuthStack.Screen name="register" component={Register} />
    </AuthStack.Navigator>
  );
}
