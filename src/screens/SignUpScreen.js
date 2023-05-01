import React from "react";
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,    
} from "react-native";
import { useState } from "react";
import TextInput from "../components/common/TextInput";
import { Colors, RegexEmail } from "../Constants";
import Button from "../components/common/Button";
import { RegexPassword, RegexName } from "../Constants";
import AddProfilePhoto from "../components/common/AddProfilePhoto";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const { width, height } = Dimensions.get("window");

const axios = require("axios").default;
//const got=require('got')
const FormData = require("form-data");
//const request=require('http')
//const fetch=require('node-fetch')
//const needle=require('needle')
/*
  -- DOCUMENTATION --
*/
const SignUpScreen = ({ props, navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [create, setCreate] = useState(true);
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        firstName: undefined,
        lastName: undefined,
        password: undefined,
        confirm: undefined,
        email: undefined,
    });

    const [image, setImage] = useState(null);
    const [imagePicked, setImagePicked] = useState(false);

    // console.log(imagePicked);
    // console.log(image);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log(result);
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setImagePicked(true);
        } else {
            // TODO upload image to server
        }
    };

    const onPressRegister = async () => {
        const firstNameError =
            firstName.length > 0 ? undefined : "You must enter a first name.";
        const lastNameError =
            lastName.length > 0 ? undefined : "You must enter a last name.";
        const passwordError =
            password.length > 0 && RegexPassword.test(password)
                ? undefined
                : "Please enter a valid password.";
        const confirmError =
            password !== confirm && password.length > 0
                ? "Passwords don't match"
                : undefined;
        const emailError =
            email.length > 0 && RegexEmail.test(email)
                ? undefined
                : "You must enter a valid email.";

        if (
            firstNameError ||
            lastNameError ||
            passwordError ||
            confirmError ||
            emailError
        ) {
            setErrors({
                firstName: firstNameError,
                lastName: lastNameError,
                password: passwordError,
                confirm: confirmError,
                email: emailError,
            });
        } else {
            setLoading(true);
            const response=await signUp(firstName, lastName, email, password);
            // console.log(response);
            if(response.error){
                //todo error handling
                setLoading(false);
            }
            else{
                AsyncStorage.setItem('uid', response.uid)
                const data=await AsyncStorage.getItem('uid')
            }
            console.log("Here");
            setLoading(false);
        }
    };

    const signUp = async (fname, lname, email, password) => {
        //console.log(data)
        let data = new FormData();
        data.append("email", email);
        data.append("password", password), data.append("firstName", fname);
        data.append("lastName", lname);
        await axios
            .post("http://localhost:4000/api/users/", data, {
                "content-type": "multipart/form-data",
            })
            .then((response) => {
                console.log(JSON.stringify(response.data));
                console.log(response);
                return response;
            })
            .catch(function (error) {
                console.log(error);
                console.log(error.data);
                return error;
            });
    };

    return (
        <KeyboardAwareScrollView
            style={{
                backgroundColor: "white",
                flex: Platform.OS === "ios" ? 1 : null,
                paddingTop: 0,
            }}
            contentContainerStyle={{
                alignItems: "center",
                justifyContent: "center",
            }}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            extraScrollHeight={25}
            keyboardShouldPersistTaps="handled"
        >
            <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View
                        style={{
                            flexDirection: "column",
                            alignItems: "center",
                            paddingTop: 25,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.navigate("Sign In")}
                        >
                            <Icon
                                name={"arrow-left"}
                                size={24}
                                color={Colors.darkGray}
                                style={styles.icon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.subtitle}>Profile</Text>
                        <Text style={styles.title}>Create your account</Text>

                        {image ? (
                            <View>
                                {image && (
                                    <Image
                                        source={{ uri: image }}
                                        style={{
                                            width: 104,
                                            height: 104,
                                            borderRadius: 1000,
                                            marginBottom: 20,
                                        }}
                                        onPress={pickImage}
                                    />
                                )}
                            </View>
                        ) : (
                            <View>
                                <AddProfilePhoto
                                    style={{
                                        margin: 10,
                                        backgroundColor: Colors.primaryGreen,
                                    }}
                                    onPress={pickImage}
                                />
                            </View>
                        )}

                        <View>
                            <TextInput
                                setText={setFirstName}
                                value={firstName}
                                placeholder={"First name"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.firstName}
                                errorMessage={"Enter a valid first name."}
                                onEndEditing={() => {
                                    if (!RegexName.test(firstName)) {
                                        setErrors({
                                            ...errors,
                                            firstName:
                                                "Please enter a valid first name.",
                                        });
                                    } else {
                                        setErrors({
                                            ...errors,
                                            firstName: undefined,
                                        });
                                    }
                                }}
                            />

                            <TextInput
                                setText={setLastName}
                                value={lastName}
                                placeholder={"Last name"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.lastName}
                                errorMessage={"Enter a valid last name."}
                                onEndEditing={() => {
                                    if (!RegexName.test(lastName)) {
                                        setErrors({
                                            ...errors,
                                            lastName:
                                                "Please enter a valid last name.",
                                        });
                                    } else {
                                        setErrors({
                                            ...errors,
                                            lastName: undefined,
                                        });
                                    }
                                }}
                            />

                            <TextInput
                                setText={setEmail}
                                value={email}
                                placeholder={"Email"}
                                isPassword={false}
                                autoCorrect={false}
                                error={errors.email}
                                errorMessage={"Enter a valid email"}
                                onEndEditing={() => {
                                    if (!RegexEmail.test(email)) {
                                        setErrors({
                                            ...errors,
                                            email: "Please enter a valid email.",
                                        });
                                    } else {
                                        setErrors({
                                            ...errors,
                                            email: undefined,
                                        });
                                    }
                                }}
                            />
                            <TextInput
                                setText={setPassword}
                                value={password}
                                placeholder={"Password"}
                                isPassword={true}
                                autoCorrect={false}
                                error={errors.password}
                                errorMessage={
                                    "Your password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and a special character."
                                }
                                onEndEditing={() => {
                                    if (!RegexPassword.test(password)) {
                                        setErrors({
                                            ...errors,
                                            password:
                                                "Please enter a valid password.",
                                        });
                                    } else {
                                        setErrors({
                                            ...errors,
                                            password: undefined,
                                        });
                                    }
                                }}
                            />
                            <TextInput
                                setText={setConfirm}
                                value={confirm}
                                placeholder={"Confirm password again"}
                                isPassword={true}
                                autoCorrect={false}
                                error={errors.confirm}
                                errorMessage={"Your password does not match."}
                            />

                            {!loading ? (
                                <Button
                                    title="Continue"
                                    onPress={onPressRegister}
                                    style={styles.button}
                                />
                            ) : (
                                <ActivityIndicator
                                    size="small"
                                    color={Colors.green.primary}
                                    style={{marginTop: 20}}
                                />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        color: Colors.darkGray,
        textAlign: "center",
        // paddingTop: height * 0.075,
        paddingBottom: 30,
    },
    subtitle: {
        // paddingLeft: -20,
        // marginTop: 100,
        paddingTop: height * 0.075,
        fontSize: 17,
        color: Colors.darkGray,
        textAlign: "center",
        // fontWeight: "bold",
        paddingBottom: 30,
        // position: "absolute",
    },
    button: {
        marginTop: height * 0.0175,
        alignSelf: "center",
        backgroundColor: Colors.green.primary,
        marginBottom: 30,
    },
    icon: {
        paddingTop: height * 0.075,
        alignSelf: "flex-start",
        position: "absolute",
        // top: 5,
        left: -150,
    },
});

export default SignUpScreen;
