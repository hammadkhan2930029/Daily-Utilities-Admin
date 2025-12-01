import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker';
import { Dropdown } from 'react-native-element-dropdown';
import firestore from '@react-native-firebase/firestore';

//=========================================================
const data = {
  categories: [
    {
      id: 1,
      name: 'Metals',
      items: [
        {
          id: 101,
          name: 'Gold',
          qualities: [
            {
              id: 1011,
              name: '24K',
              units: [
                { id: 10111, name: '1 Gram' },
                { id: 10112, name: '10 Gram' },
                { id: 10113, name: '1 Tola' },
              ],
            },
            {
              id: 1012,
              name: '22K',
              units: [
                { id: 10121, name: '1 Gram' },
                { id: 10122, name: '10 Gram' },
                { id: 10123, name: '1 Tola' },
              ],
            },
            {
              id: 1013,
              name: '18K',
              units: [
                { id: 10131, name: '1 Gram' },
                { id: 10132, name: '10 Gram' },
                { id: 10133, name: '1 Tola' },
              ],
            },
            {
              id: 1014,
              name: '12K',
              units: [
                { id: 10141, name: '1 Gram' },
                { id: 10142, name: '10 Gram' },
                { id: 10143, name: '1 Tola' },
              ],
            },
          ],
        },
        {
          id: 102,
          name: 'Silver',
          qualities: [
            {
              id: 1021,
              name: 'Pure',
              units: [
                { id: 10211, name: '1 Gram' },
                { id: 10212, name: '10 Gram' },
                { id: 10213, name: '1 Tola' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Currency',
      items: [
        {
          id: 201,
          name: 'USD',
          units: [{ id: 20111, name: '1 USD' }],
        },
        {
          id: 202,
          name: 'EUR',
          units: [{ id: 20211, name: '1 EUR' }],
        },
        {
          id: 203,
          name: 'USDT',
          units: [{ id: 20311, name: '1 USDT' }],
        },
      ],
    },
    {
      id: 3,
      name: 'Crude Oil',
      items: [
        {
          id: 301,
          name: 'Crude Oil',
          units: [
            { id: 30111, name: 'WTI Crude' },
            { id: 30112, name: 'Brent Crude' },
            { id: 30113, name: 'Murban Crude' },
          ],
        },
      ],
    },
    {
      id: 4,
      name: 'Diamonds',
      items: [
        {
          id: 401,
          name: 'Diamond',
          units: [
            { id: 40111, name: '1 Carat' },
            { id: 40112, name: '5 Carat' },
          ],
        },
      ],
    },
  ],
};
//=========================================================

export const History = props => {
  //-----------------------------------------
  const [fromDate, setFromDate] = useState(new Date());
  const [fromDateOpen, setfromDateOpen] = useState(false);
  //---------------------------------------------------
  const [toDate, setToDate] = useState(new Date());
  const [toDateOpen, setToDateOpen] = useState(false);
  // ----------------------------------------
  const [category, setCategory] = useState('');
  const [item, setItem] = useState('');

  const selectedCategory = data.categories.find(c => c.id === category);
  const selectedItem = selectedCategory?.items.find(i => i.id === item);

  console.log('selectedCategory', selectedCategory);
  console.log('selectedItem', selectedItem);
  // console.log('category', category);
  // console.log('item', item);

  //-----------------------------------------
  const navigation = useNavigation();
  const [isloading, setisLoading] = useState(true);
  const [marketData, setMarketData] = useState([]);
  const [allMarketData, setAllMarketData] = useState([]);

  const name = props?.route?.params?.name || 'All Market';

  const fetchData = async () => {
    // Loading start
    setisLoading(true);

    const result = await getMarketData();

    if (result && result.data) {
      const sortedData = result.data.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );
      setMarketData(sortedData);
      setAllMarketData(sortedData);
    }
    // Loading end
    setisLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );
  //--------------------search data-----------------------------------------------
  const searchData = async () => {
    try {
      setisLoading(true);
      let query = firestore().collection('MarketData');
      //------category filter------
      if (selectedCategory && selectedCategory.name) {
        query = query.where('category', '==', selectedCategory.name);
      }

      //------item filter--------
      if (selectedItem && selectedItem.name) {
        query = query.where('item', '==', selectedItem.name);
      }

      //-----date filter---------
      if (fromDate && toDate) {
        let startDate = fromDate.toISOString().split('T')[0];
        let endDate = toDate.toISOString().split('T')[0];
        console.log('start :', startDate);
        console.log('end :', endDate);

        query = query
          .where('date', '>=', startDate)
          .where('date', '<=', endDate);
      }

      //-------------------

      const snapShot = await query.get();

      if (!snapShot.empty) {
        const result = snapShot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('result :', result);
        setMarketData(result);
      } else {
        Alert.alert('Data not found');
        console.log('No data found');
        // setisLoading(false);

        // setFromDate(null);
        // setToDate(null);

        setMarketData([]);
        setisLoading(false);
      }

      console.log('snapshot :', snapShot);

      setisLoading(false);
    } catch (error) {
      console.log('try catch error :', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      setFromDate(new Date());
      setToDate(new Date());
      setCategory();
      setItem();
      fetchData();
      return () => {
        setFromDate(new Date());
        setToDate(new Date());
        setCategory();
        setItem();
        fetchData();
      };
    }, []),
  );

  //-----------------------------------------------------------------------------------
  const formatNumber = num => {
    if (!num) return '';
    return Number(num).toLocaleString('en-PK');
  };
  console.log('Market data', marketData);
  console.log('All Market data', allMarketData);

  //---------------------------------------------------------------------------------------

  const getItemImage = item => {
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
        if (item.category?.toLowerCase() === 'currency') {
          return AppImages.currency;
        }
        return null;
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Item Image */}
      <Image source={getItemImage(item)} style={styles.banner} />

      {/* Item Name (Ab hamesha dikhayega) */}
      <Text style={styles.name}>{item.item || 'N/A'}</Text>

      {/* Date and Quality */}
      <View style={styles.row}>
        <Text style={styles.date}>{item.date || 'N/A'}</Text>
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

        <View style={u.price ? styles.row : styles.displayNone} key={index}>
          <Text style={styles.unit}>{u.unit}</Text>
          <Text style={styles.price}>Rs {formatNumber(u.price)}</Text>
        </View>
      ))}
      <View>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditData', { id: item.id })}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // -------SkeletonCard (Ismein koi change nahi)----------------------------------------------
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
        title="History"
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
            <ScrollView>
              <View style={styles.filterCard}>
                <View style={styles.datesection}>
                  {/* -----------from date---------------- */}
                  <View>
                    <DatePicker
                      modal
                      mode="date"
                      open={fromDateOpen}
                      date={fromDate}
                      onConfirm={selectedDate => {
                        setfromDateOpen(false);
                        setFromDate(selectedDate);
                      }}
                      onCancel={() => setfromDateOpen(false)}
                    />
                    <View style={{ marginTop: 10 }}>
                      <View style={styles.datePicker}>
                        <Text
                          style={{
                            fontSize: responsiveFontSize(2.3),
                            color: '#000',
                            textAlign: 'center',
                          }}
                        >
                          {fromDate.toLocaleDateString('en-GB')}
                        </Text>
                        <TouchableOpacity onPress={() => setfromDateOpen(true)}>
                          <MaterialIcons
                            name="calendar-month"
                            size={24}
                            color={'#daa520'}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  {/* -----------to date---------------- */}

                  <View>
                    <DatePicker
                      modal
                      mode="date"
                      open={toDateOpen}
                      date={toDate}
                      onConfirm={selectedDate => {
                        setToDateOpen(false);
                        setToDate(selectedDate);
                      }}
                      onCancel={() => setToDateOpen(false)}
                    />
                    <View style={{ marginTop: 10 }}>
                      <View style={styles.datePicker}>
                        <Text
                          style={{
                            fontSize: responsiveFontSize(2.3),
                            color: '#000',
                            textAlign: 'center',
                          }}
                        >
                          {toDate.toLocaleDateString('en-GB')}
                        </Text>
                        <TouchableOpacity onPress={() => setToDateOpen(true)}>
                          <MaterialIcons
                            name="calendar-month"
                            size={24}
                            color={'#daa520'}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                {/*------------------------------------------------------------------ */}
                {/* ----Category -------*/}

                <Text style={styles.label}>Category</Text>
                <Dropdown
                  style={styles.dropdown}
                  data={data.categories.map(cat => ({
                    label: cat.name,
                    value: cat.id,
                  }))}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Category"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={styles.itemTextStyle}
                  containerStyle={styles.dropdownContainer}
                  itemContainerStyle={styles.itemContainerStyle}
                  value={category}
                  onChange={val => {
                    setCategory(val.value);
                  }}
                />

                {/* Item */}
                {category && (
                  <View>
                    <Text style={styles.label}>Sub Category</Text>
                    <Dropdown
                      style={styles.dropdown}
                      data={
                        selectedCategory?.items.map(i => ({
                          label: i.name,
                          value: i.id,
                        })) || []
                      }
                      labelField="label"
                      valueField="value"
                      placeholder="Select Item"
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      itemTextStyle={styles.itemTextStyle}
                      containerStyle={styles.dropdownContainer}
                      itemContainerStyle={styles.itemContainerStyle}
                      value={item}
                      onChange={val => {
                        setItem(val.value);
                      }}
                    />
                  </View>
                )}

                <TouchableOpacity
                  style={styles.btnView}
                  onPress={() => searchData()}
                >
                  <Text style={styles.btnText}>Search</Text>
                </TouchableOpacity>
              </View>
              {marketData.length === 0 ? (
                <Text style={styles.errorMsg}>
                  No data found for the selected filter.
                </Text>
              ) : (
                <FlatList
                  data={marketData}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => item.id || index.toString()}
                  contentContainerStyle={{ paddingBottom: 15 }}
                  ListEmptyComponent={
                    <Text style={styles.title}>No data available.</Text>
                  }
                />
              )}
            </ScrollView>
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
    padding: 10,
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
  title_1: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: '#b8860b',
    marginBottom: 12,
    textAlign: 'center',
    marginTop: responsiveHeight(2),
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
    marginTop: 12,

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
  editBtn: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: '#daa520',
    padding: 5,
    width: responsiveWidth(20),
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  editBtnText: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
  },
  //-------------------------------
  filterCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    marginTop: responsiveHeight(2),
    borderWidth: 0.5,
    borderColor: '#daa520',
    // width:responsiveWidth(90)
  },
  datesection: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  datePicker: {
    width: responsiveWidth(42),
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#000',
    elevation: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateText: {
    fontSize: responsiveFontSize(2.5),
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dropdown: {
    // width: responsiveWidth(86),
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#000',
    elevation: 3,
  },
  label: {
    fontSize: responsiveFontSize(2),
    marginBottom: 5,
    color: '#000',
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(2),
    color: '#666',
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(2),
    color: '#000',
  },
  itemTextStyle: {
    fontSize: responsiveFontSize(2),
    color: '#000',
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  itemContainerStyle: {
    backgroundColor: '#fff',
  },
  btnView: {
    backgroundColor: '#d4af37',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: responsiveWidth(90),
    elevation: 5,
  },
  btnText: {
    fontSize: responsiveFontSize(2.7),
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  errorMsg:{
    fontSize:responsiveFontSize(2.5),
    color:"#000",
    textAlign:'center',
    marginTop:responsiveHeight(5)
  },
  displayNone:{
    display:'none'
  }
});
