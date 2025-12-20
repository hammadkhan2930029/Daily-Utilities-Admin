import {
  useNavigation,
  DrawerActions,
  useFocusEffect,
} from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader'; //
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { AppImages } from '../constant/appImages';
import { getMarketData } from '../firbase/dataBase/getData';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// -----------------------------------------------------------------
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
// -----------------------------------------------------------------

const commodityPrices = [
  {
    name: 'Gold',
    price_pkr: 362000,
    unit: 'PKR per tola',
    date: '2025-08-15',
  },
  {
    name: 'Silver',
    price_pkr: 3566,
    unit: 'PKR per 10 grams',
    date: '2025-08-15',
  },
  {
    name: 'Crude Oil',
    price_pkr: 13.61,
    unit: 'PKR per OIL',
    date: '2025-08-15',
  },
  {
    name: 'Platinum',
    price_pkr: 141633,
    unit: 'PKR per tola',
    date: '2025-08-15',
  },
  {
    name: 'Diamond',
    price_pkr: 830.87,
    unit: 'PKR per DMD',
    date: '2025-08-15',
  },
];
const data = [
  { id: '24k', name: '1 tola', price: '427000' },
  { id: '22k', name: '1 tola', price: '405000' },
  { id: '18k', name: '1 tola', price: '350000' },
  { id: '12k', name: '1 tola', price: '230000' },
];
const { width } = Dimensions.get('window');

export default function HomeScreen({ route }) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  // -------------------------------------------------------
  const [marketData, setMarketData] = useState([]);

  const fetchData = async () => {
    const result = await getMarketData();
    if (result.success && result.data) {
      const sortedData = result.data.sort(
        (a,b)=> new Date(b.date) - new Date(a.date)
      )
     
      setMarketData(sortedData);
    }
    setIsLoading(false);
  };
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );
  console.log('market data', marketData);
  // =========================new code with current,yesterday,last latest date===================================
  const today = new Date();

  const currentDate = today.toISOString().split('T')[0];

  const yesterdayObj = new Date(today);
  yesterdayObj.setDate(today.getDate() - 1);
  const yesterdayDate = yesterdayObj.toISOString().split('T')[0];

  console.log('Aaj ki Date:', currentDate);
  console.log('Kal ki Date:', yesterdayDate);

  function getLatestDataByPriority(itemToFind) {
    const itemData = marketData.filter(item => item.item === itemToFind);

    let requiredData = [];

    // ------------------------------------------------------------------
    // A. Pehli Koshish: Aaj ki date dekho (currentDate)
    // ------------------------------------------------------------------
    requiredData = itemData.filter(item => item.date === currentDate);
    if (requiredData.length > 0) {
      return requiredData;
    }

    // ------------------------------------------------------------------
    // B. Doosri Koshish: Kal ki date dekho (yesterdayDate)
    // ------------------------------------------------------------------
    requiredData = itemData.filter(item => item.date === yesterdayDate);
    if (requiredData.length > 0) {
      return requiredData;
    }

    // ------------------------------------------------------------------
    // C. Teesri Koshish: Jo bhi sabse latest available date ho
    // ------------------------------------------------------------------

    const otherDates = itemData
      .filter(item => item.date !== currentDate && item.date !== yesterdayDate)
      .map(item => item.date)
      .filter((value, index, self) => self.indexOf(value) === index);

    let latestAvailableDate = null;

    if (otherDates.length > 0) {
      latestAvailableDate = otherDates.sort().pop();
    }

    if (latestAvailableDate) {
      requiredData = itemData.filter(item => item.date === latestAvailableDate);
      return requiredData;
    }

    return [];
  }
  // -------------------------------------------------------------------------------
  const allGoldItems = getLatestDataByPriority('Gold');

  const goldItems = allGoldItems.filter(
    (value, index, self) =>
      index === self.findIndex(t => t.date === value.date),
  );

  const goldData = marketData.filter(item => item.item === 'Gold');
  const goldInfo = goldData.map(item => ({
    name: item.item,
    category: item.category,
  }));

  //-----------------------------------------------------------------------------
  const allCrudeOil = getLatestDataByPriority('Crude Oil');

  const CrudeOilData = marketData.filter(item => item.item === 'Crude Oil');
  const crudeOilInfo = CrudeOilData.map(item => ({
    name: item.item,
    category: item.category,
  }));

  //--------------------------------------------------------------------------------
  const allDimonds = getLatestDataByPriority('Diamond');

  const dimondData = marketData.filter(item => item.item === 'Diamond');
  const dimondsInfo = dimondData.map(item => ({
    name: item.item,
    category: item.category,
  }));
  //---------------------------------------------------------------------------------
  const allSilverItems = getLatestDataByPriority('Silver');

  const silverItems = allSilverItems.filter(
    (value, index, self) =>
      index === self.findIndex(t => t.date === value.date),
  );

  const silverData = marketData.filter(item => item.item === 'Silver');
  const silverInfo = silverData.map(item => ({
    name: item.item,
    category: item.category,
  }));
  console.log('silver item :', allSilverItems);

  //===============================================================================================
  //----------------------------------old code ---------------------
  const dates = marketData.map(i => i.date);
  const latestDate = dates.sort().reverse()[0];

  //-------------------------------------------------------------------------------------
  const formatNumber = num => {
    if (!num) return '';
    return Number(num).toLocaleString('en-PK');
  };

  //===gold .silver,cruf oil k elawa data current,yesterday,last latest date==============================

  const uniqueOtherItems = [
    ...new Set(
      marketData
        .filter(
          item =>
            item.item !== 'Gold' &&
            item.item !== 'Crude Oil' &&
            item.item !== 'Diamond' &&
            item.item !== 'Silver',
        )
        .map(item => item.item),
    ),
  ];

  let prioritizedOtherItems = [];

  uniqueOtherItems.forEach(itemName => {
    const latestData = getLatestDataByPriority(itemName);

    if (latestData.length > 0) {
      prioritizedOtherItems.push(...latestData);
    }
  });

  // ----------------new renderitems----------------------------
  const renderItem = ({ item }) => (
    <View  style={{ paddingTop: 15 }}>
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() =>
          navigation.navigate('Details', {
            name: item.item,
            category: item.category,
          })
        }
      >
        <View style={styles.card}>
          <Image
            source={
              item.item === 'Silver'
                ? AppImages.silver
                : item.category === 'Currency'
                ? AppImages.currency
                : null
            }
            style={styles.cardImg}
          />

          <View style={styles.viewTop}>
            <Text style={styles.name}>{item.item}</Text>
            <Text style={styles.date}>Date: {item.date || 'N/A'}</Text>
          </View>

          <View>
            {item.quality && (
              <Text style={styles.text}>Quality: {item.quality}</Text>
            )}

            {item.units && item.units.length > 0 ? (
              item.units.map((u, index) => (
                <View
                  key={index}
                  style={u.price ? styles.unitRow : styles.displayNone}
                >
                  <Text style={styles.unit}>{u.unit}</Text>
                  <Text style={styles.price}>RS {formatNumber(u.price)}</Text>
                </View>
              ))
            ) : (
              <View style={styles.unitRow}>
                <Text style={styles.unit}>{item.unit}</Text>
                <Text style={styles.price}>RS {formatNumber(item.price)}</Text>
              </View>
            )}
          </View>
          <View style={styles.historyBtn1}>
            <MaterialIcons name="history" size={18} color="#fff" />
            <Text style={styles.history1}>history</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  // --- Skeleton Component ---
  const SkeletonCard = () => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.cardImg}
          shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        />
        <View style={[styles.viewTop, { borderBottomWidth: 0 }]}>
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
        </View>
        {/* Table/Unit placeholders */}
        {[1, 2, 3].map(i => (
          <View key={i} style={[styles.unitRow, { paddingHorizontal: 0 }]}>
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ width: responsiveWidth(30), height: 18 }}
              shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
            />
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={{ width: responsiveWidth(30), height: 18 }}
              shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
            />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <>
      <CustomHeader
        title="Home"
        leftIcon="menu"
        rightIcon="search"
        onRightPress={() => console.log('Search pressed')}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          {isLoading ? (
            <View style={{ padding: 10 }}>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : (
            <>
              {/* ----------------------------- */}
              <View style={{padding: 10 }}>
                {allGoldItems.length > 0 ? (
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles.cardContainer}
                    onPress={() =>
                      navigation.navigate('Details', {
                        name: goldInfo[0].name,
                        category: goldInfo[0].category,
                      })
                    }
                  >
                    <View style={styles.card}>
                      <Image source={AppImages.gold} style={styles.cardImg} />

                      <View style={styles.viewTop}>
                        <Text style={styles.name}>Gold</Text>
                        <Text style={styles.date}>
                          Date:{' '}
                          {/* Ab hum sirf array ki pehli entry ki date use karenge */}
                          {allGoldItems[0].date}
                        </Text>
                      </View>

                      {/* Table */}
                      <View style={styles.table}>
                        {/* Header Row */}
                        <View style={[styles.row, styles.header]}>
                          <Text style={[styles.cell, styles.headerText]}>
                            Quality
                          </Text>
                          <Text style={[styles.cell, styles.headerText]}>
                            Unit
                          </Text>
                          <Text style={[styles.cell, styles.headerText]}>
                            Price
                          </Text>
                        </View>

                        {/* All qualities show in same table */}
                        {allGoldItems.map(item => {
                          const tolaData = item.units.find(
                            u => u.unit === '1 Tola',
                          );
                          return (
                            <View
                              key={item.id}
                              style={
                                tolaData.price ? styles.row : styles.displayNone
                              }
                            >
                              <Text style={styles.cell}>{item.quality}</Text>
                              <Text style={styles.cell}>
                                {tolaData?.unit || '-'}
                              </Text>
                              <Text style={styles.cell}>
                                {formatNumber(tolaData?.price || '-')}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                    <View style={styles.historyBtn}>
                      <MaterialIcons name="history" size={18} color="#fff" />
                      <Text style={styles.history}>history</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 20,
                      color: '#000',
                    }}
                  >
                    No Gold Rates Available for Today
                  </Text>
                )}
              </View>
              {/* -----------------silver----------------- */}
              <View style={{ padding: 10 }}>
                {allSilverItems.length > 0 ? (
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles.cardContainer}
                    onPress={() =>
                      navigation.navigate('Details', {
                        name: silverInfo[0].name,
                        category: silverInfo[0].category,
                      })
                    }
                  >
                    <View style={styles.card}>
                      <Image source={AppImages.silver} style={styles.cardImg} />

                      <View style={styles.viewTop}>
                        <Text style={styles.name}>Silver</Text>
                        <Text style={styles.date}>
                          Date: {allSilverItems[0].date}
                        </Text>
                      </View>

                      {/* Table */}
                      <View style={styles.table}>
                        {/* Header Row */}
                        <View style={[styles.row, styles.header]}>
                          <Text style={[styles.cell, styles.headerText]}>
                            Quality
                          </Text>
                          <Text style={[styles.cell, styles.headerText]}>
                            Unit
                          </Text>
                          <Text style={[styles.cell, styles.headerText]}>
                            Price
                          </Text>
                        </View>

                        {/* All qualities show in same table */}
                        {allSilverItems.map(item => {
                          const tolaData = item.units.find(
                            u => u.unit === '1 Tola',
                          );
                          return (
                            <View
                              key={item.id}
                              style={
                                tolaData.price ? styles.row : styles.displayNone
                              }
                            >
                              <Text style={styles.cell}>{item.quality}</Text>
                              <Text style={styles.cell}>
                                {tolaData?.unit || '-'}
                              </Text>
                              <Text style={styles.cell}>
                                {formatNumber(tolaData?.price || '-')}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                    <View style={styles.historyBtn}>
                      <MaterialIcons name="history" size={18} color="#fff" />
                      <Text style={styles.history}>history</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 20,
                      color: '#000',
                    }}
                  >
                    No silver Rates Available for Today
                  </Text>
                )}
              </View>
              {/* -----------crude oil------------------ */}
              <View style={{ padding: 10 }}>
                {allCrudeOil.length > 0 ? (
                  <TouchableOpacity
                    style={styles.cardContainer}
                    onPress={() =>
                      navigation.navigate('Details', {
                        name: crudeOilInfo[0].name,
                        category: crudeOilInfo[0].category,
                      })
                    }
                  >
                    <View style={styles.card}>
                      <Image source={AppImages.oil} style={styles.cardImg} />

                      <View style={styles.viewTop}>
                        <Text style={styles.name}>Crude Oil</Text>
                        <Text style={styles.date}>Date: {latestDate}</Text>
                      </View>

                      {/* Table */}
                      <View style={styles.table}>
                        {/* Header Row */}
                        <View style={[styles.row, styles.header]}>
                          <Text style={[styles.cell, styles.headerText]}>
                            Name
                          </Text>
                          <Text style={[styles.cell, styles.headerText]}>
                            Price
                          </Text>
                        </View>

                        {/* All qualities show in same table */}
                        {allCrudeOil.map(item => {
                          return (
                            <View key={item.id} style={styles.row}>
                              <Text style={styles.cell}>{item.unit}</Text>
                              <Text style={styles.cell}>
                                {formatNumber(item.price)}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                    <View style={styles.historyBtn}>
                      <MaterialIcons name="history" size={18} color="#fff" />
                      <Text style={styles.history}>history</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 10,
                      color: '#000',
                    }}
                  >
                    No Crude Oil Rates Available for Today
                  </Text>
                )}
              </View>

              {/* -----------dimonds------------------ */}
              <View style={{ padding: 10 }}>
                {allDimonds.length > 0 ? (
                  <TouchableOpacity
                    style={styles.cardContainer}
                    onPress={() =>
                      navigation.navigate('Details', {
                        name: dimondsInfo[0].name,
                        category: dimondsInfo[0].category,
                      })
                    }
                  >
                    <View style={styles.card}>
                      <Image source={AppImages.dimond} style={styles.cardImg} />

                      <View style={styles.viewTop}>
                        <Text style={styles.name}>Diamond</Text>
                        <Text style={styles.date}>Date: {latestDate}</Text>
                      </View>

                      {/* Table */}
                      <View style={styles.table}>
                        {/* Header Row */}
                        <View style={[styles.row, styles.header]}>
                          <Text style={[styles.cell, styles.headerText]}>
                            Quality
                          </Text>
                          <Text style={[styles.cell, styles.headerText]}>
                            Price
                          </Text>
                        </View>

                        {/* All qualities show in same table */}
                        {allDimonds.map(item => {
                          return (
                            <View key={item.id} style={styles.row}>
                              <Text style={styles.cell}>{item.unit}</Text>
                              <Text style={styles.cell}>
                                {formatNumber(item.price)}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                    <View style={styles.historyBtn}>
                      <MaterialIcons name="history" size={18} color="#fff" />
                      <Text style={styles.history}>history</Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      marginTop: 10,
                      color: '#000',
                    }}
                  >
                    No diamond Rates Available for Today
                  </Text>
                )}
              </View>

              {/* -------------------------------- */}

              <FlatList
                data={prioritizedOtherItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ padding: responsiveWidth(3) }}
                scrollEnabled={false}
              />
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    marginBottom: responsiveHeight(8),
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 3,
    borderRadius: 12,
    marginBottom: responsiveHeight(1),
  },
  card: {
    width: responsiveWidth(95),

    padding: responsiveWidth(4),
    marginBottom: responsiveHeight(1),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  viewTop: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    // backgroundColor:'green',
    padding: 10,
    borderColor: '#d4af37',
    borderBottomWidth: 2,
  },
  name: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: '#333',
  },
  price: {
    fontSize: responsiveFontSize(2.2),
    color: '#d4af37', // gold-like color
    marginTop: responsiveHeight(0.5),
  },
  unit: {
    fontSize: responsiveFontSize(2),
    color: '#555',
    marginTop: responsiveHeight(0.3),
  },
  date: {
    fontSize: responsiveFontSize(2),
    color: '#888',
    marginTop: responsiveHeight(0.5),
  },
  cardImg: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  text: {
    color: '#000',
    fontSize: 14,
    marginBottom: 2,
    // backgroundColor: 'green',
    marginTop: responsiveHeight(1),
  },
  unitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    // backgroundColor: '#eee',
    padding: 5,
  },
  unit: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: responsiveHeight(1),
  },
  table: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
    // margin: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  header: {
    backgroundColor: '#d4af37',
    borderRadius: 12,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    color: '#000',
  },
  historyBtn: {
    backgroundColor: '#d4af37',
    padding: 5,
    borderRadius: 10,
    width: responsiveWidth(25),
    alignSelf: 'flex-end',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,

    elevation: 3,
  },
  history: {
    fontSize: 16,
    color: '#fff',
  },
  historyBtn1: {
    backgroundColor: '#d4af37',
    padding: 5,
    borderRadius: 10,
    width: responsiveWidth(25),
    alignSelf: 'flex-end',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: -12,
    marginRight: -5,

    elevation: 3,
  },
  history1: {
    fontSize: 16,
    color: '#fff',
  },
  displayNone: {
    display: 'none',
  },
});
