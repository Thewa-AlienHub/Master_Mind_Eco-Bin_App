import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { database, ref, push, DB } from "../../config/DB_config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import RNPickerSelect from "react-native-picker-select";
import colors from "../../Utils/colors";
import Header from "../../Components/Header_04";

const RecycleForm_04 = ({ route }) => {
  const [houseAddress, setHouseAddress] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { docID } = route.params;
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // Function to check if a string contains only letters
  const isAlphabetic = (text) => /^[A-Za-z\s]+$/.test(text);

  // Function to check if a string is numeric
  const isNumeric = (text) => /^\d+(\.\d+)?$/.test(text);

  useEffect(() => {
    // Animate error messages when they are set
    if (Object.keys(error).length > 0) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [error]);

  useEffect(() => {
    const fetchTenantAndRequestData = async () => {
      try {
        // Fetch tenant address
        const tenantDocRef = doc(DB, "tenants", docID);
        const tenantSnap = await getDoc(tenantDocRef);

        if (tenantSnap.exists()) {
          const tenantData = tenantSnap.data();
          const address = `${tenantData.Ad_Line1}, ${tenantData.Ad_Line2}, ${tenantData.Ad_Line3}, ${tenantData.City}`;
          setHouseAddress(address); // Set the address in the input box
        } else {
          console.log("No such document in tenants:", docID);
        }

        // Fetch recycle request data
        const requestDocRef = doc(DB, "recycleRequest", docID); // Adjust the collection path as needed
        const requestSnap = await getDoc(requestDocRef);

        if (requestSnap.exists()) {
          const requestData = requestSnap.data();
          setOwnerName(docID); // Set owner name as docID
          setWasteType(requestData.type); // Set waste type from the request
        } else {
          console.log("No such document in recycleRequest:", docID);
        }
      } catch (error) {
        console.error("Error fetching tenant and request data:", error);
      }
    };

    fetchTenantAndRequestData(); // Call function to fetch address and request data
  }, [docID]);

  const handleBack = () => {
    navigation.navigate("QRScan");
  };

  const handleSubmit = async () => {
    setError({});
    // Validate input before setting loading
    let isValid = true;
    let newErrors = {};
  
    if (!houseAddress.trim()) {
      newErrors.houseAddress = "House address is required";
      isValid = false;
    }
  
    if (!ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
      isValid = false;
    }
  
    if (!wasteType) {
      newErrors.wasteType = "Recycle Waste Type is required";
      isValid = false;
    }
  
    if (!weight.trim()) {
      newErrors.weight = "Weight is required";
      isValid = false;
    } else if (!isNumeric(weight)) {
      newErrors.weight = "Weight should contain only numbers";
      isValid = false;
    }
  
    if (!isValid) {
      setError(newErrors);
      return; // Stop if validation fails
    }
  
    // Proceed with loading and data submission
    setLoading(true);
    setButtonDisabled(true); // Disable the button during loading
  
    try {
      setLoading(true);
  
      // Get the current date and time
      const timestamp = Date.now();
      const dateAndTime = new Date(timestamp).toLocaleString();
      const reviewStatus = "Pending review";
  
      // Create a reference to the "forms" node in the Realtime Database
      const recycleWasteCollectionRef = ref(database, "RecycleWasteCollection");
  
      // Use the push function to add a new entry
      await push(recycleWasteCollectionRef, {
        houseAddress,
        ownerName,
        wasteType,
        weight,
        dateAndTime,
        reviewStatus,
      });
  
      // Update the Firestore document in the recycleRequest collection
      const requestDocRef = doc(DB, "recycleRequest", docID);
      await updateDoc(requestDocRef, {
        status: "Collected", // Update status field to "Collected"
      });
  
      // Reset form fields
      setHouseAddress("");
      setOwnerName("");
      setWasteType("");
      setWeight("");
  
      // Redirect to QRCodeScannerScreen with success alert
      navigation.navigate("Success", {
        alertMessage: `Successfully submitted the recycle request for ${ownerName} and updated status to Collected.`,
        disableButton: true,
      });
    } catch (error) {
      console.error("Error submitting data or updating Firestore: ", error);
      setError({ general: "Failed to submit data. Please try again." });
    } finally {
      setLoading(false);
      setButtonDisabled(false);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Header title="Recycle Request Info" onBackPress={handleBack} />
      {/* Scrollable Form Fields */}
      <View style={styles.TopBarContainer}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <View style={styles.LableContainer}>
            <Text style={styles.label}>House Address :</Text>
          </View>
          <TextInput
            style={styles.inputBox}
            placeholder="House Address"
            value={houseAddress}
            editable={false} // Make it read-only if needed
          />
          {error.houseAddress && (
            <Animated.View style={{ opacity: opacityAnim }}>
              <Text style={styles.errorText}>{error.houseAddress}</Text>
            </Animated.View>
          )}
          <View style={styles.LableContainer}>
            <Text style={styles.label}>Tenant Name :</Text>
          </View>
          <TextInput
            style={styles.inputBox}
            placeholder="Owner Name"
            value={ownerName}
            editable={false} // Make it read-only if needed
          />
          {error.ownerName && (
            <Animated.View style={{ opacity: opacityAnim }}>
              <Text style={styles.errorText}>{error.ownerName}</Text>
            </Animated.View>
          )}

          {/* Recycle Waste Type Picker */}
          <View style={styles.LableContainer}>
            <Text style={styles.label}>Recycle Waste Type :</Text>
          </View>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setWasteType(value)}
              items={[
                { label: "Paper", value: "Paper" },
                { label: "Plastic", value: "Plastic" },
                { label: "Glass", value: "Glass" },
                { label: "Metal", value: "Metal" },
                { label: "Organic", value: "Organic" },
              ]}
              placeholder={{ label: "Select a waste type...", value: null }}
              style={pickerSelectStyles}
              value={wasteType} // Set the initial value to wasteType
            />
            {error.wasteType && (
              <Animated.View style={{ opacity: opacityAnim }}>
                <Text style={styles.errorText}>{error.wasteType}</Text>
              </Animated.View>
            )}
          </View>

          <View style={styles.LableContainer}>
            <Text style={styles.label}>Weight :</Text>
          </View>
          <TextInput
            style={styles.inputBox}
            placeholder="eg : 2 Kg --> 1 or 500 g --> 0.5 "
            value={weight}
            onChangeText={setWeight}
          />
          {error.weight && (
            <Animated.View style={{ opacity: opacityAnim }}>
              <Text style={styles.errorText}>{error.weight}</Text>
            </Animated.View>
          )}
          <View style={styles.ButtonContainer}>
          <TouchableOpacity 
            style={[styles.button, buttonDisabled && styles.buttonDisabled]} 
            onPress={buttonDisabled ? null : handleSubmit} // Disable the button click
          >
            <Text style={styles.buttonText}>Submit Info</Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};


const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    color: colors.black,
    paddingRight: 30, // to ensure the text is not cut off by the dropdown arrow
  },
  inputAndroid: {
    fontSize: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
    color: colors.black,
    paddingRight: 30, // to ensure the text is not cut off by the dropdown arrow
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  TopBarContainer: {
    backgroundColor: colors.white,
    borderTopStartRadius: 70,
    borderTopEndRadius: 70,
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  formContainer: {
    marginTop: 10,
    width: "100%",
    justifyContent: "center",
  },
  TopBar: {
    fontSize: Platform.OS === "android" || Platform.OS === "ios" ? 30 : 40,
    textAlign: "center", // Center-align the heading text
    color: colors.white,
    fontSize: 36,
    fontWeight: "bold",
  },
  HLableContainer: {
    justifyContent: "center",
    alignItems: "center", // Ensure the heading container is centered
    paddingTop: 10,
    position: "absolute",
    top: 100,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    marginTop: 15,
    left: 10,
    top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  LableContainer: {
    paddingTop: 10,
    marginHorizontal: 20,
  },
  label: {
    paddingLeft: 20,
    fontSize: 24,
    color: colors.black,
  },
  inputBox: {
    height: 50,
    margin: 12,
    marginHorizontal: 35,
    borderWidth: 2,
    padding: 10,
    borderColor: colors.primary,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 100 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      web: {
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)",
      },
    }),
  },
  ButtonContainer: {
    flex: 1,
    top: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  button: {
    width: 320,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 15,
  },
  buttonText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    paddingLeft: 20,
  },
  pickerContainer: {
    height: 50,
    margin: 12,
    marginHorizontal: 35,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 10,
  },
  submitButton: {
    width: 320,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary, // Default color
    borderRadius: 15,
  },
  disabled: {
    backgroundColor: "#d3d3d3", // Light gray for disabled
  },
});

export default RecycleForm_04;
