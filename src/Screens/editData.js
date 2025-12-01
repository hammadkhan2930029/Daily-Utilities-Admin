import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getMarketData } from '../firbase/dataBase/getData';
import { string } from 'yup';
import { updateMarketitems } from '../firbase/dataBase/updatedData';
import { useToast } from 'react-native-toast-notifications';

import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

// -----------------------------------------------------------------
import LinearGradient from 'react-native-linear-gradient';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';



export const EditData = props => {

  const toast = useToast();

  const [isloding, setisLoading] = useState(true);
  const navigation = useNavigation();
  const id = props?.route?.params.id;
  const [foundItem, setFoundItem] = useState(null);
  console.log('edit data', id);
  // ---------------get data------------------------
  const getData = async () => {
    const result = await getMarketData();

    if (result && result.data) {
      const found = result.data.find(item => item.id === id);
      setFoundItem(found);
      setisLoading(false);

      // console.log('found', found);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getData();
    }, []),
  );

  console.log('get data', foundItem);

  // -----------------------------------------------
  const handleUpdate = async () => {
    setisLoading(true)
    const payload = {};
    if (foundItem.price && foundItem.unit) {
      payload.price = foundItem.price;
      payload.unit = foundItem.unit;
    }

    if (foundItem.units) {
      payload.units = foundItem.units;
    }

    const result = await updateMarketitems(foundItem.id, payload);
    if (result.success) {
      console.log('result success :', result.success);
      toast.show('Price Updated successfully!', {
        type: 'success',
        placement: 'top',
        duration: 2000,
        offset: 30,
        animationType: 'slide-in',
      });

      setTimeout(() => {
        setisLoading(false)
        navigation.goBack();
      }, 1000);
    } else {
      toast.show('update failed', {
        type: 'warning',
        placement: 'top',
        duration: 4000,
        offset: 30,
        animationType: 'slide-in',
      });
      // Alert.alert('update failed' + result.error);
      console.log('error :', result.error);
    }
  };

  // -------SkeletonCard (Ismein koi change nahi)-----------
  const SkeletonCard = () => (
    <View style={style.cardContainer}>
      <View style={style.Shimmercard}>
        {[1, 2, 3].map(i => (
          <View key={i} style={[style.input, { paddingHorizontal: 0 }]}>
            <ShimmerPlaceholder
              LinearGradient={LinearGradient}
              style={[style.input, { paddingHorizontal: 0 }]}
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
        title="Edit"
        leftIcon="arrow-back"
        rightIcon=""
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView>
        {isloding ? (
          <View>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : (
          <>
            <View style={style.scrollview}>
              {/*-------Category----------*/}

              <Text style={style.label}>Category</Text>
              <TextInput
                value={String(foundItem.category ?? '')}
                editable={false}
                style={style.input}
              />
              {/*-------item----------*/}
              <Text style={style.label}>Item</Text>
              <TextInput
                value={String(foundItem.item ?? '')}
                editable={false}
                style={style.input}
              />
              {/*-------Quality----------*/}
              {foundItem.quality && (
                <>
                  <Text style={style.label}>Quality</Text>
                  <TextInput
                    value={String(foundItem.quality ?? '')}
                    editable={false}
                    style={style.input}
                  />
                </>
              )}

              {/* -------------------Single unit--------------------- */}
              {foundItem.unit && (
                <>
                  <Text style={style.label}>Unit</Text>

                  <TextInput
                    value={String(foundItem.unit ?? '')}
                    editable={false}
                    style={style.input}
                  />
                  <Text style={style.label}>Price</Text>
                  <TextInput
                    value={String(foundItem.price ?? '')}
                    onChangeText={text => {
                      // const onlyNumbers = text.replace(/[^0-9]/g, '');
                      setFoundItem({ ...foundItem, price: text });
                    }}
                    style={style.inputPrice}
                    keyboardType="numeric"
                  />
                </>
              )}

              {/* -------------------Multiple unit--------------------- */}

              {foundItem.units && Array.isArray(foundItem.units) && (
                <>
                  <Text style={style.label}>Units & Prices</Text>
                  {foundItem.units.map((item, index) => (
                    <View>
                      <Text>Unit</Text>
                      <TextInput
                        value={String(item.unit ?? '')}
                        editable={false}
                        style={style.input}
                      />

                      <Text style={style.label}>Price</Text>
                      <TextInput
                        value={String(item.price ?? '')}
                        keyboardType="numeric"
                        style={style.inputPrice}
                        onChangeText={text => {
                          // const onlyNumbers = text.replace(/[^0-9]/g, '');
                          const updated = [...foundItem.units];
                          updated[index].price = text;
                          setFoundItem({ ...foundItem, units: updated });
                        }}
                      />
                    </View>
                  ))}
                </>
              )}
            </View>

            <TouchableOpacity
              onPress={() => handleUpdate()}
              style={style.updateBtn}
            >
              <Text style={style.btnText}>Update</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  scrollview: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    marginTop: responsiveHeight(4),
  },

  label: {
    fontSize: responsiveFontSize(2.1),
    marginBottom: 6,
    color: '#222',
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  input: {
    width: responsiveWidth(90),
    height: 52,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
    backgroundColor: '#f3f1f1ff',
    color: '#111',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  inputPrice: {
    width: responsiveWidth(90),
    height: 52,
    borderWidth: 1,
    borderColor: '#d5d5d5',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
    backgroundColor: '#ffffff',
    color: '#111',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  updateBtn: {
    backgroundColor: '#d4af37',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    width: responsiveWidth(90),
    alignSelf: 'center',
    marginBottom: responsiveHeight(2),
    elevation: 6,
    shadowColor: '#d4af37',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },

  btnText: {
    fontSize: responsiveFontSize(2.8),
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1,
  },

  Shimmercard: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
});
