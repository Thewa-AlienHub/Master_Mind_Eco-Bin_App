import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MenuButton = ({ onPress,color }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <Icon name="menu" size={34} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 40,
    marginLeft: 10,
  },
});

export default MenuButton;
