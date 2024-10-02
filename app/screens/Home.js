import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import MenuButton from '../Components/MenuButton'; // Import MenuButton
import colors from '../Utils/colors';
import NotificationBell from '../Components/NotificationBell';

const Home = ({ drawer }) => {
  const advertisements = [
    { id: 1, text: "Ad 1: Special Sale Today!" },
    { id: 2, text: "Ad 2: Buy One Get One Free!" },
    { id: 3, text: "Ad 3: New Arrivals in Store!" }
  ];

  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const handleSkipAd = () => {
    if (currentAdIndex < advertisements.length - 1) {
      setCurrentAdIndex(currentAdIndex + 1); // Move to the next ad
    } else {
      setCurrentAdIndex(0); // Restart from the first ad if it's the last one
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.advertismentContainer}>
        <View style={styles.advertismentBarheader}>
          <MenuButton color={colors.white} onPress={() => drawer.current.openDrawer()} />
          <NotificationBell color={colors.white} onPress={() => drawer.current.openDrawer()} />
          <Text style={styles.homeTxt}>Home</Text>
        </View>
        
        <View style={styles.advertismentBar}>
          <Text style={styles.adText}>{advertisements[currentAdIndex].text}</Text>
          <TouchableOpacity onPress={handleSkipAd} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip Ad</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content in homeContainer */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.homeContainer}>
          <Text style={styles.homeText}>Content 1</Text>
          <Text style={styles.homeText}>Content 2</Text>
          <Text style={styles.homeText}>Content 3</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          <Text style={styles.homeText}>Content 4</Text>
          {/* Add as many content items as you want */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  advertismentContainer: {
    height: 300,
    backgroundColor: colors.primary,
    marginHorizontal: 10,
    marginTop: 40,
    borderRadius: 40,
  },
  advertismentBar: {
    backgroundColor: colors.white,
    height: 185,
    width: 310,
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  advertismentBarheader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  homeTxt: {
    color: colors.white,
    fontSize: 40,
    marginLeft: 120,
    marginTop: 25,
    fontWeight: "bold",
  },
  adText: {
    fontSize: 20,
    color: colors.black,
    textAlign: 'center',
    marginBottom: 20,
  },
  skipButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  skipText: {
    color: colors.white,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 80,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  homeContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
  },
  homeText: {
    fontSize: 18,
    marginVertical: 10,
    color: colors.black,
  },
});

export default Home;
