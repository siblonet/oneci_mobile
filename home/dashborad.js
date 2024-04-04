import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated, TextInput, ActivityIndicator, Alert, AppState } from 'react-native';
import {
    Ionicons, MaterialCommunityIcons
} from '@expo/vector-icons';
import { picts, routx } from "../utilitis";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from "expo-linear-gradient";
import { Instapay } from '../database/database';
import { useFocusEffect } from "@react-navigation/native"
import axios from "axios";
import Cameran from './camerarunna';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';


const oneci = Instapay.getOneci();

export default function DashBoard({ navigation }) {
    const [isloaded, setIsLoaded] = useState(false);
    const [token, setToken] = useState();
    const [tackpi, setTackpi] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [nni, setNni] = useState();
    const [rejected, setRejected] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [pincode, setPincode] = useState('');
    const [unlock, setUnlock] = useState(false);
    const [wrong, setWrong] = useState(new Animated.Value(0));
    const [colar, setColor] = useState("#00b395");
    const [appState, setAppState] = useState(AppState.currentState);



    useFocusEffect(
        useCallback(() => {
            oneci.transaction((txn) => {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='oneci_instapay'",
                    [],
                    (tx, res) => {
                        if (res.rows.length === 0) {
                            txn.executeSql('DROP TABLE IF EXISTS oneci_instapay', []);
                            txn.executeSql(
                                "CREATE TABLE IF NOT EXISTS oneci_instapay(id INTEGER PRIMARY KEY AUTOINCREMENT, token VARCHAR(1000))",
                                [],
                                () => {
                                    setIsLoaded(false);
                                    console.log("Deleted and created table.");
                                },
                                (_, error) => {
                                    console.error("Error creating table:", error);
                                    setIsLoaded(false);
                                }
                            );
                        } else {
                            txn.executeSql(
                                "SELECT * FROM oneci_instapay WHERE id ='1'",
                                [],
                                (tx, results) => {
                                    if (results.rows.length === 1) {
                                        setToken(results.rows._array[0].token)
                                    } else {
                                        navigation.navigate("Connexion");

                                        setIsLoaded(false);
                                    }

                                },
                                (_, error) => {
                                    console.error("Error selecting from table:", error);
                                    setIsLoaded(false);
                                }
                            );
                        }
                    },
                    (_, error) => {
                        console.error("Error executing SQL:", error);
                        setIsLoaded(false);
                    }
                );
            });

        }, [])
    );





    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            setUnlock(false);
            setPincode("");
            setAppState(nextAppState);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, []);







    const wrongAffect = () => {
        Animated.parallel([
            Animated.timing(wrong, {
                toValue: -20,
                duration: 100,
                useNativeDriver: false
            })
        ]).start();

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(wrong, {
                    toValue: 20,
                    duration: 100,
                    useNativeDriver: false
                })
            ]).start();
        }, 120);

        setTimeout(() => {
            Animated.parallel([
                Animated.timing(wrong, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: false
                })
            ]).start();
            setTimeout(() => {
                setPincode("");
                setColor("#00b395");
            }, 200);
        }, 230);
    };


    const retrieveData = async () => {
        if (pincode.length > 4) {
            try {
                const retrievedValue = await SecureStore.getItemAsync('oneci');
                if (retrievedValue && retrievedValue == pincode) {
                    setUnlock(true)
                } else {
                    setColor("#ff0000");
                    wrongAffect();
                }
            } catch (error) {
                console.log('Error retrieving data:', error);
            }
        }
    };

    function ResetProcess() {
        setCapturedImage(null);
        setAccepted(false);
        setRejected(false);
        setNni();
    }


    function Bearerfetcher() {
        if (nni && capturedImage) {
            setIsLoaded(true);
            axios.get(`${routx.tunal}instapay/instapay`).then(answ => {
                if (answ.data.instapaytoken) {
                    verificationRequest(answ.data.instapaytoken)

                } else {
                    Alert.alert("Rejetée", "Demande Rejetée");
                    setIsLoaded(false);

                }
            }).catch(error => {
                setIsLoaded(false);
                console.log(error);
                Alert.alert("Erreur", "Verifier que vous avez internet");

            });
        } else {
            alert("NNI est obligatoire")
        }
    }

    const verificationRequest = async (Bearer) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(capturedImage, { encoding: FileSystem.EncodingType.Base64 });
            const identity = {
                NNI: nni,
                BIOMETRIC_TYPE: "AUTH_FACE",
                BIOMETRIC_TYPE: base64
            };

            const setting = { headers: { 'Authorization': `Bearer ${Bearer}` } };

            axios.post(`${routx.rnppUrl}/oneci/face-auth`, identity, setting).then(answ => {
                setAccepted(true);
                setRejected(false);
                console.log("gcg", answ.data);
                setIsLoaded(false);
            }).catch(error => {
                setRejected(true);
                setAccepted(false);
                console.log("erro", error);
                setIsLoaded(false);
            });

        } catch (error) {
            console.error("Error converting image to base64:", error);
        }

    };





    async function Log_Me_Out() {
        Alert.alert(
            "Deconnexion",
            "Êtes-vous sûr de vouloir vous déconnecter?",
            [
                {
                    text: 'Non',
                    onPress: () => console.log('Non pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Oui',
                    onPress: async () => {
                        try {
                            // Check if oneci is properly initialized
                            if (!oneci) {
                                console.error("oneci database is not initialized.");
                                return;
                            }

                            await oneci.transaction(async (txn) => {
                                console.log("in transaction");
                                await txn.executeSql(
                                    'DROP TABLE IF EXISTS oneci_instapay',
                                    [],
                                    () => {
                                        console.log("in droped");
                                    },
                                    (_, error) => {
                                        console.error("Error dropping table:", error);
                                    }
                                );

                                await txn.executeSql(
                                    "CREATE TABLE IF NOT EXISTS oneci_instapay(id INTEGER PRIMARY KEY AUTOINCREMENT, token VARCHAR(1000))",
                                    [],
                                    () => {
                                        console.log("Deleted table 'oneci_instapay' and created a new one.");
                                        setToken(""); // Assuming setToken is a function to update token state
                                        navigation.navigate("Connexion");
                                    },
                                    (_, error) => {
                                        console.error("Error creating table:", error);
                                    }
                                );
                            });
                        } catch (error) {
                            console.error("Error executing transaction:", error);
                        }
                    },
                },
            ]
        );
    };







    return (
        <>
            {tackpi ?
                <Cameran tackpi={setTackpi} setCapturedImage={setCapturedImage} />
                :


                <>
                    {unlock ?
                        <LinearGradient style={hilai.container}
                            colors={["#007fbb", "#00b395", "#28094d", "#28094d", "#f0687c"]}
                            start={{ x: 0.5, y: 1 }}
                            end={{ x: 1, y: 0.2 }}
                        >
                            <StatusBar animated={true} style="light" backgroundColor="transparent" />
                            <LinearGradient
                                style={
                                    {
                                        position: "absolute",
                                        height: 40,
                                        width: 40,
                                        right: 10,
                                        top: 45,
                                        borderRadius: 17,
                                        elevation: 5
                                    }
                                }
                                //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                                colors={["#009de0", "#f4a3af"]}
                                start={{ x: 0, y: 1.5 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <TouchableOpacity style={
                                    {
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }
                                } onPress={() => navigation.navigate("Profile")}>
                                    <Image
                                        source={picts.fingerprint}
                                        resizeMode="center"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </TouchableOpacity>
                            </LinearGradient>

                            <View style={{
                                width: capturedImage ? "70%" : "60%",
                                height: capturedImage ? "40%" : "45%",
                                borderRadius: capturedImage ? 25 : 120,
                                overflow: capturedImage ? "hidden" : "visible",
                                alignItems: "center",
                                justifyContent: "center"

                            }}>
                                {rejected &&
                                    <>

                                        <View style={
                                            {
                                                height: "100%",
                                                width: "100%",
                                                backgroundColor: "#ff0000",
                                                opacity: 0.4,
                                                position: "absolute",
                                                zIndex: 3,
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }
                                        }>

                                        </View>
                                        <TouchableOpacity style={
                                            {

                                                position: "absolute",
                                                zIndex: 4,
                                                alignSelf: "center",
                                                backgroundColor: "transparent",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }
                                        } onPress={() => ResetProcess()}>
                                            <View style={
                                                {
                                                    height: 40,
                                                    width: 40,
                                                    backgroundColor: "#eee",
                                                    borderRadius: 15,
                                                    elevation: 5
                                                }
                                            }>

                                                <Image
                                                    source={picts.rejected}
                                                    resizeMode="center"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                    }}
                                                />
                                            </View>
                                            <Text style={
                                                {
                                                    color: "#fff",
                                                    fontSize: 18,
                                                    letterSpacing: 7,
                                                    alignSelf: "center",
                                                    fontWeight: "bold"
                                                }
                                            }>Réjeté</Text>
                                        </TouchableOpacity>

                                    </>
                                }

                                {accepted &&
                                    <>

                                        <View style={
                                            {
                                                height: "100%",
                                                width: "100%",
                                                backgroundColor: "green",
                                                opacity: 0.4,
                                                position: "absolute",
                                                zIndex: 3,
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }
                                        }>

                                        </View>
                                        <TouchableOpacity style={
                                            {

                                                position: "absolute",
                                                zIndex: 4,
                                                alignSelf: "center",
                                                backgroundColor: "transparent",
                                                alignItems: "center",
                                                justifyContent: "center"
                                            }
                                        } onPress={() => ResetProcess()}>
                                            <View style={
                                                {
                                                    height: 40,
                                                    width: 40,
                                                    backgroundColor: "#eee",
                                                    borderRadius: 15,
                                                    elevation: 5
                                                }
                                            }>

                                                <Image
                                                    source={picts.park_success}
                                                    resizeMode="center"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                    }}
                                                />
                                            </View>
                                            <Text style={
                                                {
                                                    color: "#fff",
                                                    fontSize: 18,
                                                    letterSpacing: 7,
                                                    alignSelf: "center",
                                                    fontWeight: "bold"
                                                }
                                            }>Valide</Text>
                                        </TouchableOpacity>

                                    </>
                                }


                                <Image
                                    source={capturedImage ? { uri: capturedImage } : picts.faceid}
                                    resizeMode={capturedImage ? "cover" : "contain"}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                />
                            </View>

                            <View style={{ height: 50 }}>
                            </View>
                            {capturedImage ?
                                <>

                                    <View style={{
                                        height: 50,
                                        width: "90%",
                                        backgroundColor: "#ffffff",
                                        borderRadius: 11,
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        paddingHorizontal: "2%",
                                        justifyContent: "space-between",
                                        shadowOffset: {
                                            width: 0,
                                            height: 5
                                        },
                                        shadowOpacity: 0.4,
                                        shadowColor: '#000',
                                        elevation: 4
                                    }}>
                                        <View style={{ height: 30, width: 30 }}>
                                            <Image
                                                source={picts.avatar}
                                                resizeMode="center"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                            />
                                        </View>

                                        <TextInput style={{
                                            backgroundColor: 'transparent',
                                            fontSize: 17,
                                            height: 30,
                                            width: "80%",
                                            color: '#aaa',
                                        }}
                                            placeholderTextColor={'#aaa'}
                                            placeholder={'Numéro NNI'}
                                            value={nni}
                                            keyboardType="phone-pad"
                                            onChangeText={text => setNni(text)}
                                        />

                                        <MaterialCommunityIcons name="id-card" size={20} color={'#eee'} />
                                    </View>

                                    <View style={{ height: 35 }}>
                                    </View>

                                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                        <LinearGradient
                                            style={
                                                {
                                                    width: "65%",
                                                    height: 40,
                                                    borderRadius: 10,
                                                    elevation: 2,
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }
                                            }
                                            //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                                            colors={["#00b395", "#28094d", "#f0687c"]}
                                            start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 1 }}
                                        >
                                            <TouchableOpacity style={
                                                {
                                                    height: "100%",
                                                    width: "100%",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }
                                            } onPress={() => Bearerfetcher()}>
                                                {isloaded ?
                                                    <ActivityIndicator
                                                        visible={isloaded}
                                                        color="#fff"
                                                    /> :

                                                    <Text style={{ color: "#fff", fontSize: 18, letterSpacing: 7 }}>Vérifier</Text>
                                                }
                                            </TouchableOpacity>

                                        </LinearGradient>


                                        <View style={{ width: 20 }}>
                                        </View>

                                        <LinearGradient
                                            style={
                                                {
                                                    width: "10%",
                                                    height: 40,
                                                    borderRadius: 10,
                                                    elevation: 2,
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }
                                            }
                                            //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                                            colors={["#f0687c", "#28094d"]}
                                            start={{ x: 0, y: 1 }}
                                            end={{ x: 1, y: 1 }}
                                        >
                                            <TouchableOpacity style={
                                                {
                                                    height: "100%",
                                                    width: "100%",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }
                                            } onPress={() => ResetProcess()}>

                                                <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>x</Text>

                                            </TouchableOpacity>

                                        </LinearGradient>
                                    </View>

                                </>
                                :
                                <LinearGradient
                                    style={
                                        {
                                            width: "80%",
                                            height: 40,
                                            borderRadius: 10,
                                            elevation: 2,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }
                                    }
                                    //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                                    colors={["#f0687c", "#28094d", "#00b395"]}
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                >
                                    <TouchableOpacity style={
                                        {
                                            height: "100%",
                                            width: "100%",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }
                                    } onPress={() => setTackpi(true)}>
                                        <Text style={{ color: "#fff", fontSize: 18, letterSpacing: 7 }}>Procéder</Text>
                                    </TouchableOpacity>

                                </LinearGradient>
                            }


                        </LinearGradient>
                        :
                        <View style={
                            {
                                height: "100%",
                                width: "100%",
                                backgroundColor: "#eee",
                                paddingHorizontal: "7%",
                                paddingTop: "20%",
                            }
                        }>
                            <StatusBar animated={true} style="dark" backgroundColor="transparent" />

                            <LinearGradient
                                style={
                                    {
                                        alignItems: 'center',
                                        width: 45,
                                        height: 30,
                                        top: "7%",
                                        left: 10,
                                        justifyContent: "center",
                                        position: "absolute",
                                        elevation: 8,
                                        zIndex: 5,
                                        shadowOffset: {
                                            width: 0,
                                            height: 5,
                                        },
                                        shadowOpacity: 1,
                                        shadowColor: '#aaa',
                                        borderRadius: 10
                                    }
                                }
                                colors={["#28094d", "#ff0000"]}
                                start={{ x: 0, y: 1 }}
                                end={{ x: 1.5, y: 1 }}
                            >
                                <TouchableOpacity
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: "center"
                                    }}
                                    onPress={() => Log_Me_Out()}>

                                    <Ionicons name="power-outline" size={25} color={'#ff0000'} />
                                </TouchableOpacity>
                            </LinearGradient>

                            <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>

                                <Text style={{ color: "#333", fontSize: 18, fontWeight: "bold" }}>Veuillez entrer votre code</Text>
                            </View>

                            <View style={{ height: 50 }}></View>


                            <Animated.View style={
                                {
                                    width: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "row",
                                    left: wrong
                                }
                            }>
                                {pincode && [...pincode].map((digit, index) => (
                                    <View key={index} style={{
                                        backgroundColor: "#fff",
                                        height: 45,
                                        width: 45,
                                        borderRadius: 10,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                        marginRight: index === pincode.length - 1 ? 0 : 17
                                    }}>
                                        <Text style={{
                                            color: "transparent",
                                            fontSize: 18,
                                            fontWeight: "bold",
                                            backgroundColor: colar,
                                            height: 10,
                                            width: 10,
                                            borderRadius: 5
                                        }}></Text>
                                    </View>
                                ))}

                                {!pincode &&
                                    <View style={{
                                        backgroundColor: "transparent",
                                        height: 45,
                                        width: 45,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                    }}>
                                        <Text style={{
                                            color: "transparent",
                                            fontSize: 18,
                                            fontWeight: "bold",
                                            backgroundColor: "transparent",
                                            height: 10,
                                            width: 10,
                                        }}></Text>
                                    </View>
                                }

                            </Animated.View>

                            <View style={{ height: "20%" }}></View>

                            <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>

                                <View style={
                                    {
                                        width: "100%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "row"
                                    }
                                }>
                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 65,
                                        width: 65,
                                        borderRadius: 33,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                        marginRight: 50
                                    }} onPress={() => setPincode(pincode.length < 5 ? `${pincode}1` : pincode)}>
                                        <Text style={{
                                            color: "#28094d",
                                            fontSize: 40,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>1</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 65,
                                        width: 65,
                                        borderRadius: 33,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                        marginRight: 50
                                    }} onPress={() => setPincode(pincode.length < 5 ? `${pincode}2` : pincode)}>
                                        <Text style={{
                                            color: "#28094d",
                                            fontSize: 40,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>2</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 65,
                                        width: 65,
                                        borderRadius: 33,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                    }} onPress={() => setPincode(pincode.length < 5 ? `${pincode}3` : pincode)}>
                                        <Text style={{
                                            color: "#28094d",
                                            fontSize: 40,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>3</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ height: 20 }}></View>

                                <View style={
                                    {
                                        width: "100%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "row"
                                    }
                                }>
                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 65,
                                        width: 65,
                                        borderRadius: 33,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                        marginRight: 50
                                    }} onPress={() => setPincode(pincode.length < 5 ? `${pincode}4` : pincode)}>
                                        <Text style={{
                                            color: "#28094d",
                                            fontSize: 40,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>4</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 65,
                                        width: 65,
                                        borderRadius: 33,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                        marginRight: 50
                                    }} onPress={() => setPincode(pincode.length < 5 ? `${pincode}5` : pincode)}>
                                        <Text style={{
                                            color: "#28094d",
                                            fontSize: 40,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>5</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 65,
                                        width: 65,
                                        borderRadius: 33,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                    }} onPress={() => setPincode(pincode.length < 5 ? `${pincode}6` : pincode)}>
                                        <Text style={{
                                            color: "#28094d",
                                            fontSize: 40,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>6</Text>
                                    </TouchableOpacity>

                                </View>


                                <View style={{ height: 20 }}></View>


                                <View style={
                                    {
                                        width: "100%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "row"
                                    }
                                }>

                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 65,
                                        width: 65,
                                        borderRadius: 33,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                        marginRight: 50
                                    }} onPress={() => setPincode(pincode.length < 5 ? `${pincode}7` : pincode)}>
                                        <Text style={{
                                            color: "#28094d",
                                            fontSize: 40,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>7</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 65,
                                        width: 65,
                                        borderRadius: 33,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                        marginRight: 50
                                    }} onPress={() => setPincode(pincode.length < 5 ? `${pincode}8` : pincode)}>
                                        <Text style={{
                                            color: "#28094d",
                                            fontSize: 40,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>8</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 65,
                                        width: 65,
                                        borderRadius: 33,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                    }} onPress={() => setPincode(pincode.length < 5 ? `${pincode}9` : pincode)}>
                                        <Text style={{
                                            color: "#28094d",
                                            fontSize: 40,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>9</Text>
                                    </TouchableOpacity>

                                </View>

                                <View style={{ height: 20 }}></View>


                                <View style={
                                    {
                                        width: "100%",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "row"
                                    }
                                }>
                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 50,
                                        width: 50,
                                        borderRadius: 10,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                        marginRight: 50
                                    }} onPress={() => setPincode(pincode.slice(0, -1))}>
                                        <Text style={{
                                            color: "#ff0000",
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>{"<x"}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 65,
                                        width: 65,
                                        borderRadius: 33,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                        marginRight: 50
                                    }} onPress={() => setPincode(pincode.length < 5 ? `${pincode}0` : pincode)}>
                                        <Text style={{
                                            color: "#28094d",
                                            fontSize: 40,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>0</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        backgroundColor: "#fff",
                                        height: 50,
                                        width: 50,
                                        borderRadius: 10,
                                        elevation: 5,
                                        alignItems: 'center',
                                        justifyContent: "center",
                                    }} onPress={() => retrieveData()}>
                                        <Text style={{
                                            color: "#00b395",
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            borderRadius: 5
                                        }}>Ok</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    }
                </>

            }
        </>

    )
}

const hilai = StyleSheet.create({
    container: {
        backgroundColor: '#eee',
        height: "100%",
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'scroll'
    },



});
