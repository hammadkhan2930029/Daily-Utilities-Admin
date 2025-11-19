import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CustomHeader } from '../components/CustomHeader';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import auth from '@react-native-firebase/auth';
import { saveMarketData } from '../services/firestoreService';
import { useToast } from 'react-native-toast-notifications';
import { AddData } from '../firbase/dataBase/dataBase';
import { getAuth } from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

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

export const SettingsScreen = () => {
  const toast = useToast();
  const navigation = useNavigation();
  const [category, setCategory] = useState('');
  const [item, setItem] = useState('');
  const [quality, setQuality] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');

  const selectedCategory = data.categories.find(c => c.id === category);
  const selectedItem = selectedCategory?.items.find(i => i.id === item);
  const selectedQuality = selectedItem?.qualities?.find(q => q.id === quality);
  console.log('selectedquantity', selectedQuality);
  console.log('selectedItem', selectedItem);
  console.log('selectedCategory', selectedCategory);
  console.log('unit', unit);
  console.log('price ', price);
  //---------------------------------------------------

  // State ko array/object bana do
  const [unitPrices, setUnitPrices] = useState({});

  // jab bhi koi unit ka price change ho
  const handleUnitPriceChange = (unitId, price) => {
    setUnitPrices(prev => ({
      ...prev,
      [unitId]: price,
    }));
  };

  //----------------------------------------------------

  // const handleSubmit = async () => {
  //     const auth = getAuth();
  //     const userUid = auth.currentUser?.uid;  // safe check lagao

  //     if (!userUid) {
  //         toast.show("User not logged in!", {
  //             type: "danger",
  //             placement: "top",
  //             duration: 4000,
  //             offset: 30,
  //             animationType: "slide-in",
  //             style: { backgroundColor: "red" },
  //             textStyle: { color: "white" }
  //         });
  //         return;
  //     }

  //     const payload = {
  //         category: selectedCategory?.name,
  //         item: selectedItem?.name,
  //         quality: selectedQuality?.name || null,
  //         unit: selectedItem?.qualities
  //             ? selectedQuality?.units.find((u) => u.id === unit)?.name
  //             : selectedItem?.units.find((u) => u.id === unit)?.name,
  //         price: price,
  //     };

  //     console.log("🔥 Payload:", payload);

  //     const result = await AddData(userUid, payload);

  //     toast.show(result.message, {
  //         type: "success",
  //         placement: "top",
  //         duration: 4000,
  //         offset: 30,
  //         animationType: "slide-in",
  //         style: { backgroundColor: "green" },
  //         textStyle: { color: "white" }
  //     });

  //     if (result.success) {
  //         setCategory(null);
  //         setItem(null);
  //         setQuality(null);
  //         setUnit(null);
  //         setPrice(null);
  //     }
  // };

  const handleSubmit = async () => {
    const auth = getAuth();
    const userUid = auth.currentUser?.uid;

    if (!userUid) {
      toast.show('User not logged in!', { type: 'danger' });
      return;
    }

    let payload;

    if (selectedItem?.name === 'Gold' || selectedItem?.name === 'Silver') {
      // Multiple units ke sath payload
      payload = {
        category: selectedCategory?.name,
        item: selectedItem?.name,
        quality: selectedQuality?.name || null,
        units: (selectedItem?.qualities
          ? selectedQuality?.units
          : selectedItem?.units
        ).map(u => ({
          unit: u.name,
          price: unitPrices[u.id] || null,
        })),
      };
    } else {
      // Normal payload
      payload = {
        category: selectedCategory?.name,
        item: selectedItem?.name,
        quality: selectedQuality?.name || null,
        unit: selectedItem?.qualities
          ? selectedQuality?.units.find(u => u.id === unit)?.name
          : selectedItem?.units.find(u => u.id === unit)?.name,
        price: price,
      };
    }

    console.log('🔥 Payload:', payload);

    const result = await AddData(userUid, payload);

    toast.show(result.message, { type: 'success' });

    if (result.success) {
      setCategory(null);
      setItem(null);
      setQuality(null);
      setUnit(null);
      setPrice(null);
      setUnitPrices({});
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        title="Add data"
        leftIcon="menu"
        rightIcon="search"
        // onLeftPress={navigation.goBack()}
        onRightPress={() => console.log('Search pressed')}
      />
      <ScrollView style={styles.ScrollContainer}>
        <View style={styles.container}>
          {/* Category */}
          <Text style={styles.label}>Select Category</Text>
          <Dropdown
            style={styles.dropdown}
            data={data.categories.map(cat => ({
              label: cat.name,
              value: cat.id,
            }))}
            labelField="label"
            valueField="value"
            placeholder="Select Category"
            placeholderStyle={styles.placeholderStyle} // ✅ placeholder color
            selectedTextStyle={styles.selectedTextStyle} // ✅ selected item color
            itemTextStyle={styles.itemTextStyle}
            containerStyle={styles.dropdownContainer} // ✅ dropdown ka background
            itemContainerStyle={styles.itemContainerStyle}
            value={category}
            onChange={val => {
              setCategory(val.value);
              setItem(null);
              setQuality(null);
              setUnit(null);
            }}
          />

          {/* Item */}
          {category && (
            <View>
              <Text style={styles.label}>Select Item</Text>
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
                placeholderStyle={styles.placeholderStyle} // ✅ placeholder color
                selectedTextStyle={styles.selectedTextStyle} // ✅ selected item color
                itemTextStyle={styles.itemTextStyle}
                containerStyle={styles.dropdownContainer} // ✅ dropdown ka background
                itemContainerStyle={styles.itemContainerStyle}
                value={item}
                onChange={val => {
                  setItem(val.value);
                  setQuality(null);
                  setUnit(null);
                }}
              />
            </View>
          )}

          {/* Quality (only if exists) */}
          {item && selectedItem?.qualities && (
            <View>
              <Text style={styles.label}>Select Quality</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle} // ✅ placeholder color
                selectedTextStyle={styles.selectedTextStyle} // ✅ selected item color
                itemTextStyle={styles.itemTextStyle}
                containerStyle={styles.dropdownContainer} // ✅ dropdown ka background
                itemContainerStyle={styles.itemContainerStyle}
                data={selectedItem.qualities.map(q => ({
                  label: q.name,
                  value: q.id,
                }))}
                labelField="label"
                valueField="value"
                placeholder="Select Quality"
                value={quality}
                onChange={val => {
                  setQuality(val.value);
                  setUnit(null);
                }}
              />
            </View>
          )}

          {/* Unit */}
          {/* {((selectedItem && !selectedItem.qualities) || quality) && (
                        <>
                            <Text style={styles.label}>Select Unit</Text>
                            <Dropdown
                                style={styles.dropdown}
                                data={
                                    selectedItem?.qualities
                                        ? selectedQuality?.units.map((u) => ({ label: u.name, value: u.id })) || []
                                        : selectedItem?.units.map((u) => ({ label: u.name, value: u.id })) || []
                                }
                                labelField="label"
                                valueField="value"
                                placeholder="Select Unit"
                                value={unit}
                                onChange={(val) => setUnit(val.value)}
                            />
                        </>
                    )} */}

          {/* Price */}
          {/* {unit && (
                        <>
                            <Text style={styles.label}>Price</Text>
                            <TextInput
                                placeholder="Add Price"
                                style={styles.dropdown}
                                onChangeText={price => setPrice(price)}
                                value={price}
                                keyboardType="numeric"
                            />
                        </>
                    )} */}
          {/* Unit & Price Section */}
          {((selectedItem && !selectedItem.qualities) || quality) && (
            <View>
              {
                // 👇 check karo gold ya silver
                selectedItem?.name === 'Gold' ||
                selectedItem?.name === 'Silver' ? (
                  <View>
                    <Text style={styles.label}>Units & Prices</Text>
                    {(selectedItem?.qualities
                      ? selectedQuality?.units
                      : selectedItem?.units
                    )?.map(u => (
                      <View key={u.id} style={{ marginBottom: 10 }}>
                        <Text style={styles.label}>{u.name}</Text>
                        <TextInput
                          placeholder={`Price for ${u.name}`}
                          placeholderTextColor={'#b3b2b2ff'}
                          style={styles.dropdown}
                          onChangeText={value =>
                            handleUnitPriceChange(u.id, value)
                          }
                          value={unitPrices[u.id] || ''}
                          keyboardType="numeric"
                        />
                      </View>
                    ))}
                  </View>
                ) : (
                  <View>
                    <Text style={styles.label}>Select Unit</Text>
                    <Dropdown
                      placeholderStyle={styles.placeholderStyle} // ✅ placeholder color
                      selectedTextStyle={styles.selectedTextStyle} // ✅ selected item color
                      itemTextStyle={styles.itemTextStyle}
                      containerStyle={styles.dropdownContainer} // ✅ dropdown ka background
                      itemContainerStyle={styles.itemContainerStyle}
                      style={styles.dropdown}
                      data={
                        selectedItem?.qualities
                          ? selectedQuality?.units.map(u => ({
                              label: u.name,
                              value: u.id,
                            }))
                          : selectedItem?.units.map(u => ({
                              label: u.name,
                              value: u.id,
                            }))
                      }
                      labelField="label"
                      valueField="value"
                      placeholder="Select Unit"
                      value={unit}
                      onChange={val => setUnit(val.value)}
                    />

                    {unit && (
                      <View>
                        <Text style={styles.label}>Price</Text>
                        <TextInput
                          placeholderTextColor={'#b3b2b2ff'}
                          placeholder="Add Price"
                          style={styles.dropdown}
                          onChangeText={price => setPrice(price)}
                          value={price}
                          keyboardType="numeric"
                        />
                      </View>
                    )}
                  </View>
                )
              }
            </View>
          )}

          {unit && price ? (
            <>
              <TouchableOpacity style={styles.btnView} onPress={handleSubmit}>
                <Text style={styles.btnText}>Submit</Text>
              </TouchableOpacity>
            </>
          ) : (
            unitPrices && (
              <TouchableOpacity style={styles.btnView} onPress={handleSubmit}>
                <Text style={styles.btnText}>Add</Text>
              </TouchableOpacity>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    color: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
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
  },
  label: {
    fontSize: responsiveFontSize(2),
    marginBottom: 5,
    color: '#000',
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(2),
    color: '#666', // ✅ placeholder text color
  },
  selectedTextStyle: {
    fontSize: responsiveFontSize(2),
    color: '#000', // ✅ selected text black
  },
  itemTextStyle: {
    fontSize: responsiveFontSize(2),
    color: '#000', // ✅ dropdown list items black
  },
  dropdownContainer: {
    backgroundColor: '#fff', // dropdown list ka background
    borderRadius: 8,
  },
  itemContainerStyle: {
    backgroundColor: '#fff', // har item ka background white
  },
  btnView: {
    backgroundColor: '#d4af37',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: 300,
  },
  btnText: {
    fontSize: responsiveFontSize(2.7),
    color: '#fff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ScrollContainer: {
    marginBottom: responsiveHeight(10),
  },
});
