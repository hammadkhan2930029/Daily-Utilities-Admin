
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
    Text,
    View,
    Image,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar
} from "react-native";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { Formik } from "formik";
import { object, string } from 'yup';
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppImages } from "../constant/appImages";
import { loginUser } from "../firbase/Auth/LoginUser";
import { CustomHeader } from "../components/CustomHeader";

const validationSchema = object({
    email: string()
        .email("Invalid email")
        .required("Email is required"),
    password: string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
});

const Login = () => {
    const navigation = useNavigation();
    const toast = useToast();
    const [openLoader, setOpenLoader] = useState(false);

    //-----------------------------------------------
    const handleLogin = async (values) => {
        try {
            const result = await loginUser(values)
            if (result.succes) {
                // Alert.alert();
                toast.show("Successfully Loggedin", `Hello ${result.user.name}`, {
                    type: "success",
                    placement: "top",
                    duration: 3000,
                    offset: 30,
                    animationType: "slide-in",
                    style: { backgroundColor: "green" },
                    textStyle: { color: "white" }
                });
                navigation.navigate('main')
            } else {
                // Alert.alert("Login Failed", result.message);
                toast.show(result.message || "Something went wrong", {
                    type: "warning",
                    placement: "bottom",
                    duration: 4000,
                    offset: 30,
                    animationType: "slide-in",
                });
            }

        } catch (error) {
            console.log('error in login :', error)
            toast.show(error.message || "Something went wrong", {
                type: "warning",
                placement: "bottom",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
            });
        }

    }

    return (
        <View style={styles.container}>
            {/* <CustomHeader
                title="login"
                leftIcon="menu"
                rightIcon="search"
                onLeftPress={() => console.log('menu')}
                onRightPress={() => console.log("Search pressed")} /> */}

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>

                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={AppImages.logo} />
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subTitle}>Login to continue</Text>
                </View>

                {/* Formik Form */}
                <View style={styles.formContainer}>
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={(values) => {
                            handleLogin(values)

                        }}
                        validationSchema={validationSchema}
                        validateOnMount={true}
                    >
                        {({ isValid, values, errors, handleBlur, handleSubmit, handleChange, touched }) => (
                            <View>

                                {/* Email Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email"
                                    placeholderTextColor="gray"
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    keyboardType="email-address"
                                />
                                {touched.email && errors.email && (
                                    <Text style={styles.errorText}>{errors.email}</Text>
                                )}

                                {/* Password Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="gray"
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    secureTextEntry={true}
                                />
                                {touched.password && errors.password && (
                                    <Text style={styles.errorText}>{errors.password}</Text>
                                )}

                                {/* Login Button */}
                                <TouchableOpacity disabled={!isValid} activeOpacity={0.7} onPress={handleSubmit}>
                                    <View style={[styles.button, { backgroundColor: isValid ? "#d4af37" : "gray" }]}>
                                        <Text style={styles.buttonText}>LOG IN</Text>
                                    </View>
                                </TouchableOpacity>

                                {/* Register Text */}
                                <TouchableOpacity 
                                activeOpacity={0.6}
                                //  onPress={() => navigation.navigate("register")}
                                 >
                                    <Text style={styles.registerText}>Don’t have an account? Register Now</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    logoContainer: {
        alignItems: "center",
        marginBottom: responsiveHeight(5),
    },
    logo: {
        width: responsiveWidth(35),
        height: responsiveHeight(15),
        resizeMode: "contain",
        marginBottom: 15,
    },
    title: {
        fontSize: responsiveFontSize(3),
        fontWeight: "700",
        color: "#000",
    },
    subTitle: {
        fontSize: responsiveFontSize(2),
        color: "gray",
        marginTop: 5,
    },
    formContainer: {
        width: responsiveWidth(85),
        alignSelf: "center",
        padding: 20,
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        elevation: 3,
        marginBottom: responsiveHeight(10),
        

    },
    input: {
        width: "100%",
        padding: 15,
        borderRadius: 8,
        borderColor: "#ccc",
        borderWidth: 1,
        color: "#000",
        marginTop: 15,
        backgroundColor: "#fff",
    },
    errorText: {
        color: "red",
        fontSize: responsiveFontSize(1.5),
        marginTop: 5,
    },
    button: {
        marginTop: 30,
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: responsiveFontSize(2.2),
        fontWeight: "600",
        letterSpacing: 1,
    },
    registerText: {
        marginTop: 20,
        textAlign: "center",
        color: "gray",
        fontSize: responsiveFontSize(2),
    },
});

export default Login;
