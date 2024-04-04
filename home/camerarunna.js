import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import * as FaceDetector from 'expo-face-detector';
import {
    Ionicons
} from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from 'expo-status-bar';


export default function Cameran(act) {
    const [type, setType] = useState(CameraType.front);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [HasPermission, setHasPermission] = useState(permission);
    const [picturing, setPicturing] = useState(false);

    const cameraRef = useRef(null);


    useEffect(() => {
        if (!HasPermission) {
            (async () => {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
            })();
        }
    }, []);


    const handleFacesDetected = (faces) => {
        console.log(faces);
        const facedata = {
            "faces":
                [
                    {
                        "bounds": [Object],
                        "faceID": 0,
                        "rollAngle": 3.845654249191284,
                        "yawAngle": 0.9824949502944946
                    }
                ],
            "target": 133,
            "type": "face"
        }
    };


    if (!type) {
        return <NoCameraDeviceError />;
    }


    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const shootPicture = async () => {
        setPicturing(true);
        if (cameraRef.current) {
            let photo = await cameraRef.current.takePictureAsync();
            act.setCapturedImage(photo.uri);
            act.tackpi(false)
        }
    };

    return (
        <View style={hilai.container}>
            <StatusBar animated={true} style="light" backgroundColor="transparent" />

            <Camera style={hilai.camera} type={type} ref={cameraRef}
            //onFacesDetected={handleFacesDetected}
            /*faceDetectorSettings={{
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                runClassifications: FaceDetector.FaceDetectorClassifications.none,
                minDetectionInterval: 300,
                tracking: true,
            }}*/

            >
                <View style={hilai.buttonContainer}>
                    <LinearGradient
                        style={
                            {
                                height: 40,
                                width: 40,
                                borderRadius: 17,
                                elevation: 5,
                                alignItems: "center",
                                justifyContent: "center"
                            }
                        }
                        //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                        colors={["#007fbb", "#00b395"]}
                        start={{ x: 0, y: 1.5 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <TouchableOpacity style={{ alignSelf: "center", justifyContent: "center", alignItems: "center" }} onPress={() => act.tackpi(false)}>
                            <Ionicons name="close" size={30} style={{ alignSelf: "center", color: "red", fontWeight: "bold" }} />
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient
                        style={
                            {
                                height: 50,
                                width: 50,
                                borderRadius: 20,
                                overflow: "hidden",
                                padding: 3,
                                elevation: 8
                            }
                        }
                        //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                        colors={["#009de0", "#007bff", "#f4a3af", "orange", "red"]}
                        start={{ x: 0, y: 1.5 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <TouchableOpacity style={
                            {
                                alignSelf: "center",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#fff",
                                height: "100%",
                                width: "100%",
                                borderRadius: 17,
                            }
                        } onPress={() => shootPicture()}>
                            {picturing ?
                                <ActivityIndicator
                                    visible={picturing}
                                    color="#00b395"
                                    size={"large"}
                                /> :

                                <Text style={{}}></Text>
                            }
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient
                        style={
                            {
                                height: 40,
                                width: 40,
                                borderRadius: 17,
                                elevation: 5,
                                alignItems: "center",
                                justifyContent: "center"
                            }
                        }
                        //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                        colors={["#28094d", "#00b395"]}
                        start={{ x: 0, y: 1.5 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <TouchableOpacity style={{ alignSelf: "center", justifyContent: "center", alignItems: "center" }} onPress={toggleCameraType}>
                            <Ionicons name="camera-reverse-outline" size={30} style={{ alignSelf: "center", color: "#99e6ae", fontWeight: "bold" }} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </Camera>
        </View>

    );
};

const hilai = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        alignSelf: "center",
        height: "100%",
        width: "100%"
    },
    camera: {
        flex: 1,
        aspectRatio: 2.2 / 3, // Adjust aspect ratio as needed
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        alignSelf: "center"
    },
    buttonContainer: {
        flexDirection: 'row',
        position: "absolute",
        bottom: '5%',
        width: "55%",
        alignSelf: "center",
        borderRadius: 10,
        paddingVertical: 3,
        justifyContent: "space-between"
    },

    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});
