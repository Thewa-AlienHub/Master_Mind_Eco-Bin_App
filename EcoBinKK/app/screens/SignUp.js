import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, Platform, useWindowDimensions, TextInput, ScrollView, ActivityIndicator, Image } from 'react-native';
import colors from '../config/colors';
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
    const [generalError, setGeneralError] = useState(''); // For handling general errors

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
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.TopBarContainer}>
                            <Text style={styles.TopBar}>Sign Up</Text>
                        </View>
                        <View style={styles.addressLabelContainer}>
                            <View style={isMobile ? null : styles_web.formContainer}>
                                <View style={isMobile ? null : styles_web.form}>
                                    {/* Form Fields */}
                                    <View style={styles.LableContainer}>
                                        <Text style={styles.label}>Your First Name :</Text>
                                    </View>
                                    <TextInput
                                        value={FirstName}
                                        onChangeText={setFirstName}
                                        style={styles.inputBox}
                                        placeholder="Enter the First Name"
                                    />
                                    {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}
                                    <View style={styles.LableContainer}>
                                        <Text style={styles.label}>Your Last Name :</Text>
                                    </View>
                                    <TextInput
                                        value={LastName}
                                        onChangeText={setLastName}
                                        style={styles.inputBox}
                                        placeholder="Enter the Last Name"
                                    />
                                    {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
                                    <View style={styles.LableContainer}>
                                        <Text style={styles.label}>Your Contact Number :</Text>
                                    </View>
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
                                    <View style={styles.LableContainer}>
                                        <Text style={styles.label}>Email Address :</Text>
                                    </View>
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        style={styles.inputBox}
                                        placeholder="Enter Your Email Address"
                                    />
                                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                                    <View style={styles.LableContainer}>
                                        <Text style={styles.label}>Password:</Text>
                                    </View>
                                    <TextInput
                                        value={password}
                                        onChangeText={setPassword}
                                        style={styles.inputBox}
                                        placeholder="Enter the Password"
                                    />
                                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                                    <View style={styles.LableContainer}>
                                        <Text style={styles.label}>Re-enter Password:</Text>
                                    </View>
                                    <TextInput
                                        value={reEnteredPassword}
                                        onChangeText={setReEnteredPassword}
                                        style={styles.inputBox}
                                        placeholder="Re-Enter the Password"
                                    />
                                    {reEnterPasswordError ? <Text style={styles.errorText}>{reEnterPasswordError}</Text> : null}
                                </View>
                                {/* Error Message */}
                                {generalError ? <Text style={styles.generalErrorText}>{generalError}</Text> : null}
                                {/* Sign Up Button */}
                                <View style={styles.ButtonContainer}>
                                    <TouchableOpacity style={styles.button} onPress={SignUpFunction}>
                                        <Text style={styles.buttonText}>Sign Up</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.continueText}>Need to </Text>
                                    <TouchableOpacity style={styles.googleButtonContainer}>
                                        <Image
                                            source={require("../assets/google.png")}
                                            style={styles.googleImage}
                                        />
                                        <Text style={styles.googleText}>Google Sign Up</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.continueText}>or Already have Account</Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.googleText}>Login</Text>
                                    </TouchableOpacity>
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
      overflow: 'auto',
  },
  TopBarContainer: {
      backgroundColor: '#00CE5E',
      flex: 0.23,
      width: '100%',
      borderBottomStartRadius:70,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 3 : 0,
      position: 'relative',
  },
  TopBar: {
      fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
      textAlign: 'center',
      fontSize:32,
      top:-20,
      color: colors.white,
      fontWeight:'bold',
      fontFamily: 'Arial',
  },
  backButton: {
      position: 'absolute',
      left: 10,
      top: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  formContainer: {
      position: 'absolute',
      top: '22%',
      width: '100%',
  },
  LableContainer: {
      paddingTop: 10,
  },
  label: {
      paddingLeft: 20,
      fontSize: 24,
      color:'#009644',
  },
  addressLabelContainer: {
      paddingTop: 10,
      margin: 15,
  },
  ButtonContainer: {
      flex: 1,
      top: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:50,
  },
  button: {
      width: 320,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00CE5E',
      borderRadius: 15,
  },
  buttonText: {
      color:colors.white,
      fontSize: 22,
      fontWeight:"bold",
  },
  googleButtonContainer: {

    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 30,
    width: 30,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    color: colors.primary,
  },
  googleText: {
    fontSize: 15,
    
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginLeft: 20,
    marginTop: -10,
},
generalErrorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
},
 loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: colors.primary,
    },
  inputBox: {
      height: 50,
      margin: 12,
      borderWidth: 2,
      padding: 10,
      borderColor: '#009644',
      borderRadius: 10,
      ...Platform.select({
          ios: {
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
          },
          android: {
              shadowColor: 'black',
              shadowOffset: { width: 0, height: 100 },
              shadowOpacity: 1,
              shadowRadius: 2,
          },
          web: {
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
          },
          scrollViewContainer: {
            flexGrow: 1,
            paddingBottom: 150,
            maxHeight: '150vh',
        },
        
      }),
      zIndex: 10,
  },
});

const styles_web = StyleSheet.create({
  formContainer: {
      position: 'absolute',
      top: '25%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
  },
  form: {
      width: '70%',
      alignItems: 'center',
  },
});
export default SignUp;
