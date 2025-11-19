import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';
import { AppImages } from '../constant/appImages';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useEffect } from 'react';
// import { useNavigation } from '@react-navigation/native';

export const Splash = () => {
  // const navigation = useNavigation();
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace('MainApp'); // directly home par le jata hai
//     }, 3000); // 2 seconds delay
//     return () => clearTimeout(timer);
//   }, [navigation]);

  return (
    <SafeAreaView style={styles.SplashContainer}>
      <View>
        <Image
          source={AppImages.logo1}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  SplashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: responsiveWidth(50),
    height: responsiveHeight(50),
  },
});
