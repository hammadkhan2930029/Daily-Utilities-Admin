import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { handleLogout } from "../firbase/Auth/logOut";
import { CustomHeader } from "../components/CustomHeader";


export const ProfileScreen = () => {
    return (
        <SafeAreaView>
             <CustomHeader
                    title="Profile"
                    leftIcon="menu"
                    rightIcon="search"
                    onRightPress={() => console.log('Search pressed')}
                  />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>ProfileScreen</Text>
                <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: 'blue', padding: 20, width: 100,borderRadius:10,elevation:5 }}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>
                        Log out
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}