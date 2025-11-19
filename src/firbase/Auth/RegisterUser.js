import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export const registeruser = async (values) => {
    const { name, mobileNo, email, password, confirmPassword } = values;
    if (password !== confirmPassword) {
        throw new Error('password do not match')
    }
    try {
        const userCerdinals = await auth().createUserWithEmailAndPassword(email, password)

        const uid = userCerdinals.user.uid

        // --------------------------------------------
        await firestore().collection('users').doc(uid).set({
            name,
            mobileNo,
            email,
            uid,
            createdAt: firestore.FieldValue.serverTimestamp(),
        });

        console.log("User Registered:", email);
        return userCerdinals.user;


    } catch (error) {
        console.log("Error in register user:", error)
        throw error
    }
}