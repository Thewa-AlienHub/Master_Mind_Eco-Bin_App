import React, { useState } from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
  useWindowDimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import colors from '../config/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { doc, getDoc } from 'firebase/firestore';
import { DB } from '../config/DB_config';

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 600;

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

  async function LoginFunction() {
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const docRef = doc(DB, 'users', email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.password === password) {
          console.log('Login Successful');
          // Check user role and navigate accordingly
          if (data.role === 'admin' || data.role === 'user') {
            navigation.navigate('userProfile', { email: email });
          } else {
            console.log('Unknown role');
            // Handle unknown role if necessary
          }
        } else {
          setPasswordError('Incorrect password');
        }
      } else {
        setEmailError('No user found with this email');
      }
    } catch (error) {
      console.log('Error fetching', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text>Loading...</Text>
          </View>
        ) : (
          <>
            <View style={styles.TopBarContainer}>
              <Text style={styles.TopBar}>Login</Text>
            </View>
            <View style={styles.addressLabelContainer}>
              <View style={isMobile ? null : styles_web.formContainer}>
                <View style={isMobile ? null : styles_web.form}>
                  <View style={styles.LableContainer}>
                    <Text style={styles.label}>Email Address :</Text>
                  </View>
                  <TextInput
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.inputBox}
                    placeholder="Enter Your Email Address"
                  />
                  {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                  <View style={styles.LableContainer}>
                    <Text style={styles.label}>Password:</Text>
                  </View>
                  <TextInput
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.inputBox}
                    placeholder="Enter the Password"
                    secureTextEntry={!passwordVisible}
                  />
                  {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Text style={styles.togglePasswordText}>
                      {passwordVisible ? 'Hide' : 'Show'} Password
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.ButtonContainer}>
                  <TouchableOpacity style={styles.button} onPress={LoginFunction}>
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>
                  <Text style={styles.continueText}>or continue with</Text>
                  <TouchableOpacity style={styles.googleButtonContainer}>
                    <Image
                      source={require('../assets/google.png')}
                      style={styles.googleImage}
                    />
                    <Text style={styles.googleText}>Google Login</Text>
                  </TouchableOpacity>
                  <Text style={styles.continueText}>or Not Signup yet</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.googleText}>Sign Up</Text>
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
    borderBottomStartRadius: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight * 3 : 0,
    position: 'relative',
  },
  TopBar: {
    fontSize: Platform.OS === 'android' || Platform.OS === 'ios' ? 30 : 40,
    textAlign: 'center',
    fontSize: 32,
    top: -20,
    color: colors.white,
    fontWeight: 'bold',
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
    color: '#009644',
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
    marginBottom: 50,
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
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  googleButtonContainer: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 30,
    width: 30,
  },
  continueText: {
    textAlign: 'center',
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
  togglePasswordText: {
    color: colors.primary,
    fontSize: 14,
    marginLeft: 20,
    marginTop: 10,
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
    }),
    zIndex: 10,
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 150,
    maxHeight: '150vh',
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

export default Login;
