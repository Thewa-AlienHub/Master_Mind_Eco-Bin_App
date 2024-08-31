import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

const UserProfile = () => {
  const handleEditProfile = () => {
    // Navigate to edit profile screen or perform some action
  };

  const handlePostPress = (postId) => {
    // Navigate to the selected post
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://your-avatar-url.com/avatar.png' }} 
          style={styles.profileImage}
        />
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>150</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>1200</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>300</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.userName}>John Doe</Text>
      <Text style={styles.userBio}>Traveler | Photographer | Dreamer 🌍📸</Text>

      <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      
      <View style={styles.postsContainer}>
        {/* Placeholder for posts. Replace with dynamic content */}
        <TouchableOpacity style={styles.post} onPress={() => handlePostPress(1)}>
          <Image 
            source={{ uri: 'https://your-image-url.com/post1.jpg' }} 
            style={styles.postImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.post} onPress={() => handlePostPress(2)}>
          <Image 
            source={{ uri: 'https://your-image-url.com/post2.jpg' }} 
            style={styles.postImage}
          />
        </TouchableOpacity>
        {/* Add more posts dynamically */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginLeft: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#888',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  userBio: {
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  editButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  postsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  post: {
    width: '32%',
    marginVertical: 5,
  },
  postImage: {
    width: '100%',
    height: 120,
    borderRadius: 5,
  },
});

export default UserProfile;
