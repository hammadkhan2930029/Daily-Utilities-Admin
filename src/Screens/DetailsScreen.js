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
const data = [
  {
    id: '1',
    date: '2025-08-27',
    perGram: 'Rs. 18,500',
    tenGrams: 'Rs. 185,000',
    oneTola: 'Rs. 215,800',
  },
  {
    id: '2',
    date: '2025-08-26',
    perGram: 'Rs. 18,450',
    tenGrams: 'Rs. 184,500',
    oneTola: 'Rs. 215,300',
  },
  {
    id: '3',
    date: '2025-08-25',
    perGram: 'Rs. 18,400',
    tenGrams: 'Rs. 184,000',
    oneTola: 'Rs. 214,800',
  },
];

export const GoldPriceHistory = props => {
  // const { name, category } = props.route.params
  // const lowerCaseName = name ? name.toLowerCase() : '';
  // const lowerCaseCategory = category ? category.toLowerCase() : '';
  const [isloading, setisLoading] = useState(true);
  const name = props?.route?.params?.name || null;
  const category = props?.route?.params?.category || null;

  const lowerCaseName = name ? name.toLowerCase() : null;
  const lowerCaseCategory = category ? category.toLowerCase() : null;

  const navigation = useNavigation();
  //-----------------------------------------
  const [marketData, setMarketData] = useState([]);

  const fetchData = async () => {
    const result = await getMarketData();

    if (result.success) {
      if (lowerCaseName && lowerCaseCategory) {
        // agar props me data mila to filter karo
        const filtered = result.data.filter(
          i =>
            i.item?.toLowerCase() === lowerCaseName &&
            i.category?.toLowerCase() === lowerCaseCategory,
        );
        setMarketData(filtered);
        setisLoading(false)
      } else {
        // agar props empty hain to pura data dikhao
        setMarketData(result.data);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );
  console.log('market data detail', marketData);
  //------------------------------------------------
  const formatNumber = num => {
    if (!num) return '';
    return Number(num).toLocaleString('en-PK'); // ya 'en-IN' ya 'en-US'
  };
  //------------------------------------------------

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.item?.toLowerCase() === lowerCaseName ? (
        <View>
          <Image
            source={
              item.item === 'Silver'
                ? AppImages.silver
                : item.item === 'Gold'
                ? AppImages.gold
                : item.item === 'Platinum'
                ? AppImages.platinum
                : item.item === 'Crude Oil'
                ? AppImages.oil
                : item.item === 'Diamond'
                ? AppImages.dimond
                : item.category === 'Currency'
                ? AppImages.currency
                : null
            }
            style={styles.banner}
          />
          <View style={styles.row}>
            <Text style={styles.date}>{item.createdAt}</Text>
            {item.quality && (
              <View style={styles.quality}>
                <Text style={styles.qualityText}>{item.quality || ''}</Text>
              </View>
            )}
          </View>

          {/* Direct unit & price (jab units array na ho) */}
          {item.unit && item.price && (
            <View style={styles.row}>
              <Text style={styles.unit}>{item.unit}</Text>
              <Text style={styles.price}>{formatNumber(item.price)}</Text>
            </View>
          )}

          {/* Units array (agar available ho) */}
          {item.units?.map((u, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.unit}>{u.unit}</Text>
              <Text style={styles.price}>{formatNumber(u.price)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View>
          <View>
            <Image
              source={
                item.item === 'Silver'
                  ? AppImages.silver
                  : item.item === 'Gold'
                  ? AppImages.gold
                  : item.item === 'Platinum'
                  ? AppImages.platinum
                  : item.item === 'Crude Oil'
                  ? AppImages.oil
                  : item.item === 'Diamond'
                  ? AppImages.dimond
                  : item.category === 'Currency'
                  ? AppImages.currency
                  : null
              }
              style={styles.banner}
            />
          </View>
          <Text style={styles.name}>{item.item}</Text>

          <View style={styles.row}>
            <Text style={styles.date}>{item.createdAt}</Text>
            {item.quality && (
              <View style={styles.quality}>
                <Text style={styles.qualityText}>{item.quality || ''}</Text>
              </View>
            )}
          </View>

          {/* Direct unit & price (jab units array na ho) */}
          {item.unit && item.price && (
            <View style={styles.row}>
              <Text style={styles.unit}>{item.unit}</Text>
              <Text style={styles.price}>{formatNumber(item.price)}</Text>
            </View>
          )}

          {/* Units array (agar available ho) */}
          {item.units?.map((u, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.unit}>{u.unit}</Text>
              <Text style={styles.price}>{formatNumber(u.price)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  // -------SkeletonCard-----------

  const SkeletonCard = () => (
    <View style={styles.cardContainer}>
      <View style={styles.cardPlaceholder}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.bannerPlaceholder}
          shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        />
        {/* <View style={[styles.viewTop, { borderBottomWidth: 0 }]}>
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ width: responsiveWidth(20), height: 20 }}
            shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
          />
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{ width: responsiveWidth(25), height: 16 }}
            shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
          />
        </View> */}
        {/* Table/Unit placeholders */}
        {[1, 2, 3].map(i => (
          <View key={i} style={[styles.unit, { paddingHorizontal: 0 }]}>
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ width: responsiveWidth(80), height: 18, marginBottom:responsiveHeight(1)}}
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
        title="Details"
        leftIcon="arrow-back"
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
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 15 }}
              ListHeaderComponent={
                <>
                  <Text style={styles.title}>{`${
                    name || ''
                  } Price history`}</Text>
                </>
              }
            />
          </>
        )}
      </View>
    </View>
  );
};

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
    width:responsiveWidth(90),
    alignSelf:'center'

  },
  cardPlaceholder:{

    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    // borderWidth: 0.5,
    // borderColor: '#daa520',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.2,
    // shadowRadius: 4,
    // elevation: 4,
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
    // marginBottom: 8,
    // borderBottomWidth: 1,
    // borderBottomColor: '#daa520',
    // paddingBottom: 4,
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
    padding: '5px',
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
