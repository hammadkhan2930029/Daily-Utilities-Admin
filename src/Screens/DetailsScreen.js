import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
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
import firestore from '@react-native-firebase/firestore';
import { useToast } from 'react-native-toast-notifications';
import { date } from 'yup';

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
  const toast = useToast();
  //-----------------------------------------
  const [fromDate, setFromDate] = useState(new Date());
  const [fromDateOpen, setfromDateOpen] = useState(false);
  //---------------------------------------------------
  const [toDate, setToDate] = useState(new Date());
  const [toDateOpen, setToDateOpen] = useState(false);
  //---------------------------------------------------

  const [isloading, setisLoading] = useState(true);
  const name = props?.route?.params?.name || null;
  const category = props?.route?.params?.category || null;

  const lowerCaseName = name ? name.toLowerCase() : null;
  const lowerCaseCategory = category ? category.toLowerCase() : null;
  console.log('lowercase Category :', lowerCaseCategory);
  console.log('lowercase name :', lowerCaseName);

  const navigation = useNavigation();
  //-----------------------------------------
  const [marketData, setMarketData] = useState([]);
  const [filteredData, setfilterData] = useState([]);

  const fetchData = async () => {
    const result = await getMarketData();

    if (result.success) {
      if (lowerCaseName && lowerCaseCategory) {
        const filtered = result.data.filter(
          i =>
            i.item?.toLowerCase() === lowerCaseName &&
            i.category?.toLowerCase() === lowerCaseCategory,
        );
        console.log('filter data ', filtered);
        setMarketData(filtered);
        setisLoading(false);
      } else {
        setMarketData(result.data);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );
  //------------------------------------------------
  const formatNumber = num => {
    if (!num) return '';
    return Number(num).toLocaleString('en-PK');
  };

  //--------------------filter by date----------------------------
  const normalizeDate = d => new Date(d).toISOString().split('T')[0];

  const searchBydate = async () => {
    try {
      setisLoading(true);

      const startDate = normalizeDate(fromDate);
      const endDate = normalizeDate(toDate);
      console.log('start :', startDate);
      console.log('end :', endDate);

      const filtered = marketData.filter(item => {
        if (!item.date) return false;

        const d = new Date(item.date);
        if (isNaN(d)) return false;

        const itemDate = normalizeDate(d);
        return itemDate >= startDate && itemDate <= endDate;
      });
      if (filtered.length === 0) {
        toast.show('Data not found', {
          type: 'warning',
          placement: 'top',
          duration: 3000,
          offset: 30,
          animationType: 'slide-in',
        });
      }
      console.log('filtered Data : ', filtered);
      setfilterData(filtered);
    } catch (error) {
      console.log('try catch error :', error);
      setisLoading(false);
    } finally {
      setisLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  //--------------------------------------------------------------

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
            <Text style={styles.date}>{item.date}</Text>
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
            <View style={u.price ? styles.row : styles.displayNone} key={index}>
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
            <Text style={styles.date}>{item.date}</Text>
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
            <View style={u.price ? styles.row : styles.displayNone} key={index}>
              <Text style={styles.unit}>{u.unit}</Text>
              <Text style={styles.price}>{formatNumber(u.price)}</Text>
            </View>
          ))}
        </View>
      )}
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

  // -----------check filter ctive or not--------------
  const listData =
    filteredData && filteredData.length > 0 ? filteredData : marketData;

  // -------SkeletonCard-----------

  const SkeletonCard = () => (
    <View style={styles.cardContainer}>
      <View style={styles.cardPlaceholder}>
        <ShimmerPlaceholder
          LinearGradient={LinearGradient}
          style={styles.bannerPlaceholder}
          shimmerColors={['#f0f0f0', '#e0e0e0', '#f0f0f0']}
        />

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
          <ScrollView>
            <Text style={styles.title}>{`${name || ''} Price history`}</Text>
            <View style={styles.filterCard}>
              <View style={styles.datesection}>
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
              <TouchableOpacity
                style={styles.btnView}
                onPress={() => searchBydate()}
              >
                <Text style={styles.btnText}>Search</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={listData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingBottom: 15 }}
            />
          </ScrollView>
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
    marginBottom: 5,
    marginTop: 10,

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

  //--------------------------------
  filterCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2),

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
  btnView: {
    backgroundColor: '#d4af37',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    // width: responsiveWidth(90),
    elevation: 5,
  },
  btnText: {
    fontSize: responsiveFontSize(2.7),
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  displayNone: {
    display: 'none',
  },
});
