// Header.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../Utils/colors";

const Header_04 = ({ title, onBackPress }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Icon name="chevron-back" size={40} color={colors.white} />
      </TouchableOpacity>
      <View style={styles.HLableContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    backgroundColor: colors.primary,
    height: 170,
  },
  backButton: {
    marginRight: 20,
    marginTop: 70,
    marginLeft: 15,
  },
  headerTitle: {
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
});

export default Header_04;
