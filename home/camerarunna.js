import React from "react";
import { StyleSheet } from "react-native";
import { Camera, useCameraPermission, useCameraDevice } from "react-native-vision-camera";

export default function Cameran({ navigation }) {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice("front");
    //
    if (!hasPermission) {
        // If camera permission is not granted, request permission
        requestPermission();
        return null; // You may want to render something else while waiting for permission
    }

    if (!device) {
        return <NoCameraDeviceError />;
    }

    return (
        <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true} // Set isActive to true to start the camera
        />
    );
}
