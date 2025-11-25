import firestore from '@react-native-firebase/firestore';

export const updateMarketitems = async (id, data) => {
  try {
    await firestore().collection('MarketData').doc(id).update(data);

    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};
