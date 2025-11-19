import firestore from '@react-native-firebase/firestore';

export const getMarketData = async () => {
  try {
    const snapShot = await firestore()
      .collection('MarketData')
      .orderBy('createdAt', 'desc')
      .get();

    let data = [];
    snapShot.forEach((doc) => {
      const docData = doc.data();
      data.push({
        id: doc.id,
        ...docData,
        createdAt: docData.createdAt || null, // already string hai
      });
    });

    return { success: true, data };
  } catch (error) {
    console.log("Get data Error:", error);
    return { success: false, message: error.message };
  }
};
