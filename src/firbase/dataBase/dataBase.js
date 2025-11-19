import firestore from '@react-native-firebase/firestore';

export const AddData = async (uid, payload) => {
    try {
        const date = new Date();
        const onlyDate = date.toISOString().split("T")[0]; // sirf date

        await firestore().collection('MarketData').add({
            uid,
            ...payload,
            createdAt: onlyDate,
        });

        return { success: true, message: 'Data Added Successfully' };

    } catch (error) {
        console.log('set data error:', error);
        return { success: false, message: error.message };
    }
};
