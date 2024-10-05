import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { database, ref, update, onValue } from "../../config/DB_config";
import Icon from "react-native-vector-icons/Ionicons";
import colors from "../../Utils/colors";

const ReportViewScreen = () => {
  const route = useRoute();
  const { report } = route.params;
  const navigation = useNavigation();
  const [isCompleted, setIsCompleted] = useState(
    report.reviewStatus === "Completed"
  );

  useEffect(() => {
    const reportRef = ref(database, `RecycleWasteCollection/${report.id}`);

    const unsubscribe = onValue(reportRef, (snapshot) => {
      const updatedReport = snapshot.val();
      if (updatedReport.reviewStatus === "Completed") {
        setIsCompleted(true);
      }
    });

    return () => unsubscribe();
  }, [report.id]);

  const handleBack = () => {
    navigation.navigate("History");
  };

  // Function to update the review status to 'Completed'
  const handleCompleteReview = () => {
    Alert.alert(
      "Confirm Completion",
      "Are you sure you want to complete this review?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            const reportRef = ref(
              database,
              `RecycleWasteCollection/${report.id}`
            );

            update(reportRef, { reviewStatus: "Completed" })
              .then(() => {
                console.log("Review status updated to Completed");
                setIsCompleted(true); // Disable the button after update
                Alert.alert("Success", "Review status updated to Completed");
                navigation.navigate("History");
              })
              .catch((error) => {
                console.error("Error updating review status: ", error);
                Alert.alert(
                  "Error",
                  "Failed to update review status. Please try again."
                );
              });
          },
        },
      ]
    );
  };

  const statusColor = isCompleted ? "green" : "red";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
    >
      <View style={styles.TopBarContainer}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButtonContainer}
        >
          <Icon name="chevron-back" size={40} color="white" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image
            source={require("../../assets/binLogo.png")}
            style={styles.logo}
          />
          <Text style={styles.TopBar}>Collection Info</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Tenant Name: {report.ownerName}</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.row}>
            <Text style={styles.label}>Address: {report.houseAddress}</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.row}>
            <Text style={styles.label}>Date: {report.dateAndTime}</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.row}>
            <Text style={styles.label}>Waste Type: {report.wasteType}</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.row}>
            <Text style={styles.label}>Weight: {report.weight} Kg</Text>
          </View>
          <View style={styles.separator} />

          <View style={styles.row}>
            <Text style={[styles.label, { color: statusColor }]}>
              Review Status: {report.reviewStatus}
            </Text>
          </View>
          <View style={styles.separator} />

          <TouchableOpacity
            style={[
              styles.completeButton,
              isCompleted && styles.buttonDisabled,
            ]}
            onPress={handleCompleteReview}
            disabled={isCompleted}
          >
            <Text style={styles.completeButtonText}>Complete Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  TopBarContainer: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 15,
    width: "100%",
    borderBottomStartRadius: 90,
    borderBottomEndRadius: 90,
    alignItems: "center",
    position: "relative",
    minHeight: 300,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  backButtonContainer: {
    position: "absolute",
    marginTop: 30,
    left: 15,
    top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  logo: {
    top: 9,
    width: 140,
    height: 140,
  },
  TopBar: {
    top: 20,
    fontSize: 30,
    textAlign: "center",
    color: colors.white,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 15,
    flexGrow: 1,
    paddingBottom: 30,
    marginTop: 15,
    alignItems: "center",
  },
  card: {
    width: "90%",
    backgroundColor: "#DFDFDF",
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    borderColor: "#6EC6B2",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "flex-start",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#929292",
    marginVertical: 10,
  },
  completeButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  completeButtonText: {
    color: colors.white,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  buttonDisabled: {
    backgroundColor: "gray",
  },
});

export default ReportViewScreen;
