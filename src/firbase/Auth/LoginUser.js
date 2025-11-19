import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const loginUser = async (values) => {
    const { email, password } = values
    try {
        const result = await auth().signInWithEmailAndPassword(email, password)
        const uid = result.user.uid

        const userDoc = await firestore().collection('users').doc(uid).get()

        if (!userDoc.exists) {
            throw new Error("User data not found");

        }
        return {
            succes: true,
            user: userDoc.data()
        }

    } catch (error) {
        console.log('error in login:', error)
    }
}