const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.yourFunction = functions.https.onRequest(async (req, res) => {
  const { qrData } = req.body;

  try {
    const userSnapshot = await admin
      .firestore()
      .collection("users")
      .doc(qrData)
      .get();
    const userData = userSnapshot.data();

    if (userData && userData.token) {
      const message = {
        notification: {
          title: "QR Code Scanned",
          body: "Your QR code was scanned successfully!",
        },
        token: userData.token,
      };

      await admin.messaging().send(message);
      res
        .status(200)
        .send({ success: true, message: "Notification sent successfully!" });
    } else {
      res
        .status(404)
        .send({
          success: false,
          message: "User not found or no token available",
        });
    }
  } catch (error) {
    console.error("Error fetching user data or sending notification:", error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
});
