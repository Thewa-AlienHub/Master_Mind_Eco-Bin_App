import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import Lottie from 'lottie-react-native';

const DoneScreen = ({ navigation,route }) => {
    const {email} = route.params;
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#00CE5E" />
            <Lottie
                source={require('../../assets/done.json')} // Update the path accordingly
                autoPlay
                loop={false}
                onAnimationFinish={() => {
                    // Optional: Navigate to another screen after the animation finishes
                    navigation.navigate('NextScreen'); // Update 'NextScreen' as needed
                }}
                style={styles.animation}//testing comment 22
            />
            <Text style={styles.doneText}>Done!</Text>
            <Text style={styles.messageText}>Your task has been successfully completed.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00CE5E',
        padding: 20,
    },
    animation: {
        width: 200, // Adjust as necessary
        height: 200, // Adjust as necessary
    },
    doneText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 20,
    },
    messageText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default DoneScreen;
