import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { useNavigation, DrawerActions } from '@react-navigation/native';
import { AppImages } from '../constant/appImages';
import {
  responsiveHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
export const CustomHeader = ({
  title = 'Header',
  onLeftPress,
  onRightPress,
  leftIcon = 'arrow-back',
  rightIcon = null,
}) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={styles.container}>
        {/* Left Icon */}
        <TouchableOpacity onPress={onLeftPress} style={styles.iconContainer}>
          {leftIcon && <Ionicons name={leftIcon} size={24} color="#000" />}
        </TouchableOpacity>

        {/* Title */}
        {title === 'Home' ? (
          <Image source={AppImages.logo1} style={styles.logo} />
        ) : (
          <Text style={styles.title}>{title}</Text>
        )}

        {/* Right Icon */}
        <TouchableOpacity onPress={onRightPress} style={styles.iconContainer}>
          {rightIcon && <Ionicons name={rightIcon} size={24} color="#000" />}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    elevation: 5,
  },
  container: {
    height: responsiveHeight(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 4,
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  logo: {
    width: responsiveScreenWidth(18),
    resizeMode: 'contain',
  },
});
