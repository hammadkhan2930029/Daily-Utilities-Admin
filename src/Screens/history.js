import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { AppImages } from '../constant/appImages';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getMarketData } from '../firbase/dataBase/getData';
// -----------------------------------------------------------------
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
// -----------------------------------------------------------------

// Props se aane wala data aur uski filtering logic ab HATA di gayi hai

export const History = props => {
  const navigation = useNavigation();
  const [isloading, setisLoading] = useState(true);
  const [marketData, setMarketData] = useState([]);
  
  // Ab name aur category ko use nahi kar rahe hain
  const name = props?.route?.params?.name || 'All Market'; 
  
  const fetchData = async () => {
    // Loading start
    setisLoading(true);
    
    // Sirf data fetch karo, koi filtering nahi
    const result = await getMarketData();
    
    if (result && result.data) {
      // Data ko reverse kar dete hain taake latest items upar dikhein (optional)
      const sortedData = result.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMarketData(sortedData);
    }
    // Loading end
    setisLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );
  // console.log('market data detail', marketData); // Debugging ke liye

  //------------------------------------------------
  const formatNumber = num => {
    if (!num) return '';
    return Number(num).toLocaleString('en-PK');
  };
  //------------------------------------------------

  // Item ke naam ke mutabiq image select karega
  const getItemImage = (item) => {
    const itemName = item.item?.toLowerCase();
    
    switch (itemName) {
      case 'gold':
        return AppImages.gold;
      case 'silver':
        return AppImages.silver;
      case 'platinum':
        return AppImages.platinum;
      case 'crude oil':
        return AppImages.oil;
      case 'diamond':
        return AppImages.dimond;
      default:
        // Agar item in sab mein se koi nahi hai, toh category check karo ya null
        if (item.category?.toLowerCase() === 'currency') {
            return AppImages.currency;
        }
        return null;
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Item Image */}
      <Image
        source={getItemImage(item)}
        style={styles.banner}
      />
      
      {/* Item Name (Ab hamesha dikhayega) */}
      <Text style={styles.name}>{item.item || 'N/A'}</Text>

      {/* Date and Quality */}
      <View style={styles.row}>
        <Text style={styles.date}>{item.createdAt || 'N/A'}</Text>
        {item.quality && (
          <View style={styles.quality}>
            <Text style={styles.qualityText}>{item.quality || ''}</Text>
          </View>
        )}
      </View>

      {/* Prices */}
      {/* Direct unit & price (agar units array na ho) */}
      {item.unit && item.price && (
        <View style={styles.row}>
          <Text style={styles.unit}>{item.unit}</Text>
          <Text style={styles.price}>Rs {formatNumber(item.price)}</Text>
        </View>
      )}

      {/* Units array (agar available ho) */}
      {item.units?.map((u, index) => (
        <View style={styles.row} key={index}>
          <Text style={styles.unit}>{u.unit}</Text>
          <Text style={styles.price}>Rs {formatNumber(u.price)}</Text>
        </View>
      ))}
    </View>
  );

  // -------SkeletonCard (Ismein koi change nahi)-----------
  const SkeletonCard = () => (
    <View style={styles.cardContainer}>
      <View style={styles.cardPlaceholder}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.bannerPlaceholder}
          shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        />
        
        {/* Table/Unit placeholders */}
        {[1, 2, 3].map(i => (
          <View key={i} style={[styles.unit, { paddingHorizontal: 0 }]}>
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{
                width: responsiveWidth(80),
                height: 18,
                marginBottom: responsiveHeight(1),
              }}
              shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
            />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        title="History" // Title 'History' set kar diya hai
        leftIcon="menu"
        rightIcon="search"
        onLeftPress={() => navigation.goBack()}
        onRightPress={() => console.log('Search pressed')}
      />
      <View style={styles.container}>
        {isloading ? (
          <View style={{ padding: 10 }}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <>
            <FlatList
              data={marketData}
              renderItem={renderItem}
              keyExtractor={(item, index) => item.id || index.toString()} // Fallback keyExtractor
              contentContainerStyle={{ paddingBottom: 15 }}
              ListHeaderComponent={
                <Text style={styles.title}>{`${name} Price History`}</Text>
              }
              ListEmptyComponent={
                <Text style={styles.title}>No data available.</Text>
              }
            />
          </>
        )}
      </View>
    </View>
  );
};

// ... Styles (Styles mein koi zaroori change nahi hai)
// Styles yahan wahi hain jo aapne diye hain.
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f2f2f2',
      paddingLeft: 15,
      paddingRight: 15,
      marginBottom: responsiveHeight(8),
    },
    cardContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      elevation: 4,
      borderRadius: 12,
      marginBottom: responsiveHeight(1),
      width: responsiveWidth(90),
      alignSelf: 'center',
    },
    cardPlaceholder: {
      borderRadius: 12,
      padding: 15,
      marginBottom: 12,
    },
    bannerPlaceholder: {
      width: responsiveWidth(80),
      height: 120,
      borderRadius: 15,
      marginBottom: 15,
    },
    banner: {
      width: '100%',
      height: 120,
      borderRadius: 15,
      marginBottom: 15,
    },
    title: {
      fontSize: responsiveFontSize(3),
      fontWeight: 'bold',
      color: '#b8860b',
      marginBottom: 12,
      textAlign: 'center',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 15,
      marginBottom: 12,
      borderWidth: 0.5,
      borderColor: '#daa520',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    date: {
      fontSize: responsiveFontSize(2.4),
      color: '#8b7500',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 4,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      padding: 5,
    },
    unit: {
      fontSize: responsiveFontSize(2),
      color: '#444',
    },
    price: {
      fontSize: responsiveFontSize(2),
      fontWeight: 'bold',
      color: '#b8860b',
    },
    quality: {
      backgroundColor: '#b8860b',
      padding: 5,
      borderRadius: 10,
      width: responsiveWidth(15),
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
    },
    qualityText: {
      fontSize: responsiveFontSize(1.8),
      color: '#fff',
      fontWeight: 'bold',
      padding: 5,
    },
    name: {
      fontSize: responsiveFontSize(2.8),
      fontWeight: 'bold',
      color: '#8b7500',
      marginBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#daa520',
      paddingBottom: 4,
    },
  });