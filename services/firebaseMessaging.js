import firebase from "firebase/app";
import "firebase/messaging";

const messaging = firebase.messaging();

// Request permission to send notifications
export const requestPermission = async () => {
  try {
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log("Firebase Messaging Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting permission:", error);
  }
};

// Handle incoming notifications
export const onMessageListener = () => {
  return new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
};
