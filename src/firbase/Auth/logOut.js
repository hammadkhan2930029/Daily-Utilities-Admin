
import auth from '@react-native-firebase/auth';
export const handleLogout = async () => {
  try {
    await auth().signOut();
    console.log("User logged out!");
  } catch (error) {
    console.log("Logout error: ", error);
  }
};
