
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
    StatusBar,
    Alert
} from "react-native";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import { Formik } from "formik";
import { object, string, ref } from 'yup';
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppImages } from "../constant/appImages";
import { registeruser } from "../firbase/Auth/RegisterUser";
import { CustomHeader } from "../components/CustomHeader";

const validationSchema = object({
    name: string()
        .min(3, "Name must be at least 3 characters")
        .required("Name is required"),
    email: string().email("Invalid email").required("Email is required"),
    mobileNo: string()
        .matches(/^(\+92|92|0)(\d{10})$/, 'Mobile Number is not valid')
        .required('Mobile number is required'),
    password: string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: string()
        .oneOf([ref('password'), null], "Passwords must match")
        .required("Confirm Password is required"),

});

const Register = () => {
    const navigation = useNavigation();
    const toast = useToast();
    const [openLoader, setOpenLoader] = useState(false);
    //----------------------------------------------
    const handleRegister = async (values) => {
        try {
            const user = await registeruser(values)
            toast.show("User created!", {
                type: "success",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
                style: { backgroundColor: "green" },
                textStyle: { color: "white" }
            });
            navigation.navigate("login")

        } catch (error) {
            console.log('error in register', error)
            toast.show(error.message || "Something went wrong", {
                type: "warning",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
            });
        }

    }

    return (
        <View style={styles.container}>
            <CustomHeader
                title="Register"
                leftIcon="arrow-back"
                rightIcon="search"
                onLeftPress={() => navigation.navigate("login")}
                onRightPress={() => console.log("Search pressed")} />

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>

                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={AppImages.logo} />

                </View>

                {/* Formik Form */}
                <View style={styles.formContainer}>
                    <Formik
                        initialValues={{ name: '', mobileNo: '', email: '', password: '', confirmPassword: '' }}
                        onSubmit={handleRegister}
                        validationSchema={validationSchema}
                        validateOnMount={true}
                    >
                        {({ isValid, values, errors, handleBlur, handleSubmit, handleChange, touched }) => (
                            <View>
                                {/* Email Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Name"
                                    placeholderTextColor="gray"
                                    value={values.name}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    keyboardType="email-address"
                                />
                                {touched.name && errors.name && (
                                    <Text style={styles.errorText}>{errors.name}</Text>
                                )}
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
                                {/* Email Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mobile No"
                                    placeholderTextColor="gray"
                                    value={values.mobileNo}
                                    onChangeText={handleChange('mobileNo')}
                                    onBlur={handleBlur('mobileNo')}
                                    keyboardType="numeric"
                                />
                                {touched.mobileNo && errors.mobileNo && (
                                    <Text style={styles.errorText}>{errors.mobileNo}</Text>
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

                                {/* Password Input */}
                                <TextInput
                                    style={styles.input}
                                    placeholder="ConfirmPassword"
                                    placeholderTextColor="gray"
                                    value={values.confirmPassword}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    secureTextEntry={true}
                                />
                                {touched.confirmPassword && errors.confirmPassword && (
                                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                )}

                                {/* Login Button */}
                                <TouchableOpacity disabled={!isValid} activeOpacity={0.7} onPress={handleSubmit}>
                                    <View style={[styles.button, { backgroundColor: isValid ? "#4CAF50" : "gray" }]}>
                                        <Text style={styles.buttonText}>Register</Text>
                                    </View>
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
        marginTop:10
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

export default Register;
