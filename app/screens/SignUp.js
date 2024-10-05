import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Platform, useWindowDimensions, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import colors from '../Utils/colors';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { DB } from '../config/DB_config';

function SignUp({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reEnteredPassword, setReEnteredPassword] = useState('');
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [ContactNum, setContactNum] = useState('');
    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [reEnterPasswordError, setReEnterPasswordError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [contactNumError, setContactNumError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    function validateInputs() {
        let valid = true;

        if (!FirstName.trim()) {
            setFirstNameError('First Name is required');
            valid = false;
        } else {
            setFirstNameError('');
        }

        if (!LastName.trim()) {
            setLastNameError('Last Name is required');
            valid = false;
        } else {
            setLastNameError('');
        }

        if (!ContactNum.trim()) {
            setContactNumError('Contact Number is required');
            valid = false;
        } else if (!/^\d{10}$/.test(ContactNum)) {
            setContactNumError('Invalid Contact Number');
            valid = false;
        } else {
            setContactNumError('');
        }

        if (!email.trim()) {
            setEmailError('Email is required');
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Invalid Email Address');
            valid = false;
        } else {
            setEmailError('');
        }

        if (!password.trim()) {
            setPasswordError('Password is required');
            valid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            valid = false;
        } else {
            setPasswordError('');
        }

        if (password !== reEnteredPassword) {
            setReEnterPasswordError('Passwords do not match');
            valid = false;
        } else {
            setReEnterPasswordError('');
        }

        return valid;
    }

    async function SignUpFunction() {
        if (!validateInputs()) {
            return;
        }
        setLoading(true);
    
        try {
            const docRef = doc(DB, "users", email);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                setLoading(false);
                setGeneralError('Email is already registered. Please use a different email.');
                return;
            }
    
            await setDoc(doc(DB, "users", email), {
                FirstName: FirstName,
                LastName: LastName,
                ContactNum: ContactNum,
                email: email,
                password: password,
                role: 'user', 
            });
    
            setLoading(false);
            navigation.navigate('Login');
        } catch (error) {
            setLoading(false);
            console.error("Error during signup: ", error);
            setGeneralError('An error occurred during signup. Please try again.');
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Loading</Text>
                </View>
                ) : (
                    <>
                        <View style={styles.TopBarContainer}>
                            <Text style={styles.TopBar}>Sign Up</Text>
                        
                        </View>
                        <View style= {styles.formbackground}>
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                            <Text style={styles.label}>Your First Name :</Text>
                                <TextInput
                                     value={FirstName}
                                     onChangeText={setFirstName}
                                     style={styles.inputBox}
                                     placeholder="Enter the First Name"
                                />
                                {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

                                <Text style={styles.label}>Your Last Name :</Text>
                                <TextInput
                                     value={LastName}
                                     onChangeText={setLastName}
                                     style={styles.inputBox}
                                     placeholder="Enter the Last Name"
                                />
                              
                              {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
                                        <Text style={styles.label}>Your Contact Number :</Text>
                                    <TextInput
                                     value={ContactNum}
                                        onChangeText={(text) => {
        
                                        if (/^\d*$/.test(text)) {
                                        setContactNum(text);
                                        setContactNumError(''); 
                                          } else {
                                          setContactNumError('Invalid Contact Number');
                                            }
                                        }}
                                        style={styles.inputBox}
                                         placeholder="Contact Number"
                                         keyboardType="numeric" 
                                            />
                                    {contactNumError ? <Text style={styles.errorText}>{contactNumError}</Text> : null}
                                   
                                        <Text style={styles.label}>Email Address :</Text>
                                    
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        style={styles.inputBox}
                                        placeholder="Enter Your Email Address"
                                    />
                                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                                    
                                        <Text style={styles.label}>Password:</Text>
                                    
                                    <TextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        style={styles.inputBox}
                                        placeholder="Enter the Password"
                                    />
                                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                                   
                                        <Text style={styles.label}>Re-enter Password:</Text>
                                    
                                    <TextInput
                                        value={reEnteredPassword}
                                        onChangeText={setReEnteredPassword}
                                        style={styles.inputBox}
                                        placeholder="Re-Enter the Password"
                                    />
                                    {reEnterPasswordError ? <Text style={styles.errorText}>{reEnterPasswordError}</Text> : null}
                              
                            </View>
                            {generalError ? <Text style={styles.generalErrorText}>{generalError}</Text> : null}
                            <View style={styles.ButtonContainer}>
                                <TouchableOpacity style={styles.button} onPress={SignUpFunction}>
                                    <Text style={styles.buttonText}>Sign Up</Text>
                                </TouchableOpacity>

                                            <View style={styles.orContainer}>
                                                <View style={styles.line} />
                                                <Text style={styles.orText}>Or</Text>
                                                <View style={styles.line} />
                                            </View>

                                            <View style={styles.signupContainer}>
                                                <Text style={styles.signupPrompt}>Already Have an Account </Text>
                                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                                    <Text style={styles.signUpText}>Login</Text>
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
        height: 1000,
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
        color:colors.white,
        fontSize: 20,
        fontWeight: 'bold',
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
        color: colors.black,
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

export default SignUp;
