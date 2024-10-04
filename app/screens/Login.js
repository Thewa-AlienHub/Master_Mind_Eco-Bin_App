import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Platform, useWindowDimensions, TextInput, ScrollView, ActivityIndicator, Image } from 'react-native';
import colors from '../Utils/colors'; 
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { DB } from '../config/DB_config';
import { useFocusEffect } from '@react-navigation/native';


function Login({ navigation }) {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    useFocusEffect(
        React.useCallback(() => {
            setEmail('');
            setPassword('');
            setEmailError('');
            setPasswordError('');
        }, [])
    );

    function validateInputs() {
        let valid = true;

        if (!email) {
            setEmailError('Email is required');
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Invalid email address');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            valid = false;
        } else {
            setPasswordError('');
        }

        return valid;
    }

    function LoginFunction() {
        if (!validateInputs()) {
            return;
        }

        setLoading(true);

        const fetchLoginData = async () => {
            try {
                const docRef = doc(DB, "users", email);
                const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.password === password) {
            console.log("Login Successful");
            if (data.role === "admin") {
              console.log("Unknown role admin");
            } else if (data.role === "user") {
              const loggedInData = { data: data };
              setUser(loggedInData);
              console.log(loggedInData);
              navigation.navigate("MainBar", {
                data: loggedInData,
              });
            } else if (data.role === "collector") {
              const loggedInData = { data: data };
              setUser(loggedInData);
              console.log(loggedInData);
              navigation.navigate("QRScan", { data: loggedInData });
            } else {
              console.log("Unknown role");
            }
          } else {
            setPasswordError("Incorrect password");
          }
        } else {
          setEmailError("No user found with this email");
        }
      } catch (error) {
        console.log("Error fetching", error);
      } finally {
        setLoading(false);
      }
    };

        fetchLoginData();
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.dark} />
                    <Text style={styles.loadingText}>Loading</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.TopBarContainer}>
                            <Text style={styles.TopBar}>Login</Text>
                        
                        </View>
                        <View style= {styles.formbackground}>
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>User E-mail :</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={(text) => { setEmail(text) }}
                                    style={styles.inputBox}
                                    placeholder="Enter Your E-mail"
                                />
                                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                                <Text style={styles.label}>Password :</Text>
                                <TextInput
                                    value={password}
                                    onChangeText={(text) => setPassword(text)}
                                    style={styles.inputBox}
                                    placeholder="Enter Your Password"
                                    secureTextEntry={!passwordVisible}
                                />
                                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                                <View style={styles.PWcontainer}>
                                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                                    <Text style={styles.togglePasswordText}>
                                        {passwordVisible ? 'Hide' : 'Show'} Password
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                    <Text style={styles.forgotPassword}>Forgot password?</Text>
                                </TouchableOpacity>
                                </View>
                              
                            </View>
                            <View style={styles.ButtonContainer}>
                                <TouchableOpacity style={styles.button} onPress={LoginFunction}>
                                    <Text style={styles.buttonText}>Continue</Text>
                                </TouchableOpacity>

                                            <View style={styles.orContainer}>
                                                <View style={styles.line} />
                                                <Text style={styles.orText}>Or</Text>
                                                <View style={styles.line} />
                                            </View>

                                            <TouchableOpacity style={styles.googleButtonContainer}>
                                                <Image
                                                    source={require("../assets/google.png")}
                                                    style={styles.googleImage}
                                                />
                                                <Text style={styles.googleText}>Login with Google</Text>
                                            </TouchableOpacity>

                                            <View style={styles.signupContainer}>
                                                <Text style={styles.signupPrompt}>Don't have an Account?</Text>
                                                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                                                    <Text style={styles.signUpText}>Sign Up</Text>
                                                </TouchableOpacity>
                                            </View>
                            </View>
                        
                        
                        </View>
                        </View>
                        
                    </>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.primary,
    
    },
    TopBarContainer: {
       
        flex: 0.23,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2: 70,
    },
    TopBar: {
        fontSize: 48,
        color: colors.white,
        fontWeight: 'bold',
    },
    formContainer: {
        marginTop: 5,
        paddingHorizontal: 20,
        width: '95%',
        alignSelf: 'center',
      
        
    },
    formbackground: {
        backgroundColor: colors.white,
        flex: 1,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        marginTop: 10,
        height: 700,
        width: '100%',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 2: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        color: colors.black,
        marginBottom: 5,
        fontWeight:"500",
        
    },
    inputBox: {
        height: 50,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderColor: colors.subitm,
        borderRadius: 10,
        marginBottom: 10,
    },
    errorText: {
        color: colors.red,
        fontSize: 12,
    },
    forgotPassword: {
        fontSize: 14,
        color: colors.red,
        textAlign: 'left',
        
    },
    togglePasswordText: {
        color: colors.dark,
        fontSize: 14,
        textAlign: 'right',
        marginRight: 100,
    },
    ButtonContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    button: {
        width: 300,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 15,
        marginBottom: 20,
    },
    buttonText: {
        color: colors.white,
        fontSize: 20,
        fontWeight: 'bold',
    },
    
    googleButtonContainer: {
        flexDirection: "row",
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 50,
        padding: 10,
        alignItems: 'center',
        width: 300,
        justifyContent: 'center',
        marginBottom: 20,
    },
    googleImage: {
        height: 24,
        width: 24,
        marginRight: 10,
    },
    googleText: {
        fontSize: 15,
        color: colors.dark,
    },
    signupPrompt: {
        fontSize: 16,
        color: colors.black,
        
    },
    signUpText: {
        fontSize: 16,
        color: colors.dark,
        fontWeight: 'bold',
        marginLeft: 5,
      

    },
    signupContainer: {
        flexDirection: 'row',  
        justifyContent: 'center',  
        alignItems: 'center',  
        marginTop: 20,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'center', 
        marginVertical: 20, 
    },
    line: {
        height: 1, 
        flex: 1, 
        backgroundColor: colors.subitm, 
        marginHorizontal: 40, 
    },
    orText: {
        fontSize: 16,
        color: colors.black ,
    },
    PWcontainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
      
    },
    loadingText:{
        color:colors.dark,
        fontSize:30,
        textAlign:"center"
    },
    loadingContainer:{
       margin: 100,
       marginTop:300,
       justifyContent:"center",
       backgroundColor:colors.white,
       padding:20,
       borderRadius:20,
          
    },
});

export default Login;
