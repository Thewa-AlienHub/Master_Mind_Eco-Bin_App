import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NotificationBell = ({ onPress,color }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <Icon name="notifications" size={30} color={color} style={styles.iconStyle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 40,
    marginLeft: 10,
  },
  iconStyle:{
    transform: [{ rotate: '330deg'}]
  }
});

export default NotificationBell;