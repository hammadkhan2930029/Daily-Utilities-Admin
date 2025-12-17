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
import { Dropdown } from 'react-native-element-dropdown';

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
          name: 'SAR',
          units: [{ id: 20311, name: '1 SAR' }],
        },
        {
          id: 204,
          name: 'GBP',
          units: [{ id: 20411, name: '1 GBP' }],
        },
        {
          id: 205,
          name: 'KWD',
          units: [{ id: 20511, name: '1 KWD' }],
        },
        {
          id: 206,
          name: 'OMR',
          units: [{ id: 20611, name: '1 OMR' }],
        },
        {
          id: 207,
          name: 'QAR',
          units: [{ id: 20711, name: '1 QAR' }],
        },
        {
          id: 208,
          name: 'AED',
          units: [{ id: 20811, name: '1 AED' }],
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

//  <Dropdown
//                     placeholderStyle={style.placeholderStyle}
//                     selectedTextStyle={style.selectedTextStyle}
//                     itemTextStyle={style.itemTextStyle}
//                     containerStyle={style.dropdownContainer}
//                     itemContainerStyle={style.itemContainerStyle}
//                     style={style.dropdown}
//                     data={
//                       selectedItem?.qualities
//                         ? selectedQuality?.units.map(u => ({
//                             label: u.name,
//                             value: u.id,
//                           }))
//                         : selectedItem?.units.map(u => ({
//                             label: u.name,
//                             value: u.id,
//                           }))
//                     }
//                     labelField="label"
//                     valueField="value"
//                     placeholder="Select Unit"
//                     value={unit}
//                     onChange={val => setUnit(val.value)}
//                   />

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
  console.log('data', data.categories);

  // -----------------------------------------------
  const handleUpdate = async () => {
    setisLoading(true);
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
        setisLoading(false);
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

  //-----------------------------------------
  const getmatchedItem = () => {
    if (!foundItem) return null;

    const category = data.categories.find(c => c.name === foundItem.category);
    if (!category) return null;

    const item = category.items.find(i => i.name === foundItem.item);
    if (!item) return null;
    return item;
  };

  const getUnitForDropDown = () => {
    const matchedItem = getmatchedItem();
    if (!matchedItem) return [];

    if (foundItem.quality && matchedItem.qualities) {
      const quality = matchedItem.qualities.find(
        q => q.name === foundItem.quality,
      );
      if (!quality) return [];

      return quality.units.map(u => ({
        label: u.name,
        value: u.name,
      }));
    }

    if (matchedItem.units) {
      return matchedItem.units.map(u => ({
        label: u.name,
        value: u.name,
      }));
    }

    return [];
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
              {foundItem.unit && !foundItem.units && (
                <>
                  <Text style={style.label}>Unit</Text>

                  <Dropdown
                    style={style.dropdown}
                    placeholderStyle={style.placeholderStyle}
                    selectedTextStyle={style.selectedTextStyle}
                    itemTextStyle={style.itemTextStyle}
                    containerStyle={style.dropdownContainer}
                    itemContainerStyle={style.itemContainerStyle}
                    data={getUnitForDropDown()}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Unit"
                    value={foundItem.unit}
                    onChange={item =>
                      setFoundItem({ ...foundItem, unit: item.value })
                    }
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

              {Array.isArray(foundItem.units) && foundItem.units.length > 0 && (
                <>
                  <Text style={style.label}>Units & Prices</Text>
                  {foundItem.units.map((item, index) => (
                    <View>
                      <Text>Unit</Text>
                      <Dropdown
                        style={style.dropdown}
                        placeholderStyle={style.placeholderStyle}
                        selectedTextStyle={style.selectedTextStyle}
                        itemTextStyle={style.itemTextStyle}
                        containerStyle={style.dropdownContainer}
                        itemContainerStyle={style.itemContainerStyle}
                        data={getUnitForDropDown()}
                        labelField="label"
                        valueField="value"
                        placeholder="Select Unit"
                        value={item.unit}
                        onChange={item => {
                          let updated = [...foundItem.units];
                          updated[index].unit = item.value;
                          setFoundItem({ ...foundItem, unit: updated });
                        }}
                      />

                      <Text style={style.label}>Price</Text>
                      <TextInput
                        value={String(item.price ?? '')}
                        keyboardType="numeric"
                        style={style.inputPrice}
                        onChangeText={text => {
                          const updated = [...foundItem.units];
                          updated[index].price = text; // ✅ sirf is index ka price update ho
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
  dropdown: {
    width: responsiveWidth(90),
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
});
