import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const loginUser = async values => {
  const { email, password } = values;
  try {
    const result = await auth().signInWithEmailAndPassword(email, password);
    const uid = result.user.uid;

    const userDoc = await firestore().collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return { success: false, message: 'User data not found' };
    }
    return {
      success: true,
      user: userDoc.data(),
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};
