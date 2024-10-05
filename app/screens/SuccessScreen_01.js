import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import colors from "../Utils/colors";

const SuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get totalAmount from route parameters 
  const { totalAmount } = route.params;

  const handleOk = () => {
    navigation.goBack(); // This will go back to the previous screen
  };

  return (
    <View style={styles.container}>
      {/* Robot and Garbage Bin Image */}
      <Image
        source={require("../assets/images/Group 27.png")}
        style={styles.robotImage}
      />
      {/* Success Message Container */}
      <View style={styles.messageContainer}>
        <View style={styles.checkIconContainer}>
          {/* Check Icon */}
          <Text style={styles.checkIcon}>✓</Text>
        </View>

        {/* Success Text */}
        <Text style={styles.successText}>
          Payment of LKR {totalAmount} was successful!
        </Text>

        {/* OK Button */}
        <TouchableOpacity style={styles.okButton} onPress={handleOk}>
          <Text style={styles.okButtonText}>Ok</Text>
        </TouchableOpacity>

        <Text style={styles.qouteText}>Recycle More, Earn More!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  robotImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
    marginLeft:55
  },
  messageContainer: {
    width: "80%",
    backgroundColor: '#E6E6E6',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderColor: "#6EC6B2",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  checkIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkIcon: {
    fontSize: 70,
    color: colors.white,
  },
  successText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
  },
  qouteText: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 20,
  },
  okButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  okButtonText: {
    color: colors.white,
    fontSize: 24,
  },
});

export default SuccessScreen;
