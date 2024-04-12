import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TextInput, ActivityIndicator, Keyboard, Alert } from 'react-native';
import {
    Ionicons
} from '@expo/vector-icons';
import { picts, routx } from "../utilitis";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from "expo-linear-gradient";
import * as SecureStore from 'expo-secure-store';
import { Instapay } from '../database/database';
import axios from "axios";


const oneci = Instapay.getOneci();



const HEIGHT = Dimensions.get("window").height;

export default function ConneXion({ navigation }) {
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();
    const [secure, setSecure] = useState(true);
    const [isloaded, setIsLoaded] = useState(false);
    const [pincode, setPincode] = useState('');
    const [connected, setConnected] = useState(false);


    useEffect(() => {
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
                                    navigation.navigate("Home");
                                } else {
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
    }, []);



    const saveData = async () => {
        const yeahpermi = await SecureStore.getItemAsync('yeah');

        if (pincode.length == 5) {
            try {
                if (!yeahpermi) {
                    await SecureStore.setItemAsync('yeah', '5');
                }
                await SecureStore.setItemAsync('oneci', pincode);
                navigation.navigate("Home");
            } catch (error) {
                console.log('Error saving data:', error);
            }
        } else {
            alert("5 chiffres pour le verrouillage de l'app")
        }

    };


    const Connect = async () => {
        setIsLoaded(true);
        Keyboard.dismiss();

        const person = {
            phone: phone,
            motdepass: password,
        };

        try {
            if (phone && password) {
                const response = await axios.post(`${routx.tunal}instapay/login/instapay`, person);
                if (response.data.token) {
                    const splo = response.data.token.split("°");
                    if (splo[4] === "GIFV") {
                        oneci.transaction((tx) => {
                            tx.executeSql(
                                'INSERT INTO oneci_instapay(token) VALUES (?)',
                                [response.data.token],
                                (tx, results) => {
                                    if (results.rowsAffected > 0) {
                                        setConnected(true);
                                        setIsLoaded(false);

                                    } else {
                                        alert('There was an error during the insertion!');
                                        setIsLoaded(false);
                                    }
                                },
                                (_, error) => {
                                    console.error("Error inserting into table:", error);
                                    setIsLoaded(false);
                                }
                            );
                        });
                    } else {
                        Alert.alert("Authorisation Requise", "Permission Réjeté");
                        setIsLoaded(false);
                    }
                } else {
                    Alert.alert("Information Rejetée", "Veillez saisir correctement vos identifiants");
                    setIsLoaded(false);
                }
            } else {
                Alert.alert("Information Rejetée", "Veillez saisir correctement vos identifiants");
                setIsLoaded(false);
            }
        } catch (error) {
            console.error("Error:", error);
            Alert.alert("Information Rejetée", "Veillez saisir correctement vos identifiants");
            setIsLoaded(false);
        }
    };



    return (
        <View style={hilai.container}>
            <StatusBar animated={true} style="light" backgroundColor="transparent" />

            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: HEIGHT,
                        width: 200,
                        left: 0,
                        borderTopRightRadius: 120,
                        //zIndex: 2
                    }
                }
                //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                colors={["#00b395", "#eee", "#eee"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 2, y: 0.1 }}
            >
            </LinearGradient>

            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: HEIGHT,
                        width: 140,
                        right: 0,
                        borderBottomLeftRadius: 70
                    }
                }
                //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                colors={["#eee", "#00b395"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>




            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: 40,
                        width: 40,
                        left: 7,
                        top: 120,
                        borderRadius: 10,
                        elevation: 5
                    }
                }
                //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                colors={["#fff", "#00b395"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>


            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: 40,
                        width: 40,
                        left: 15,
                        top: 150,
                        borderRadius: 10,
                        elevation: 5
                    }
                }
                //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                colors={["#f0687c", "#00b395"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>


            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: 40,
                        width: 40,
                        left: 7,
                        top: 190,
                        borderRadius: 10,
                        elevation: 5
                    }
                }
                //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                colors={["#eee", "#00b395"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>



            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: 40,
                        width: 40,
                        right: 5,
                        bottom: 250,
                        borderRadius: 10,
                        elevation: 5
                    }
                }
                //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                colors={["#007fbb", "#f0687c"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>


            <LinearGradient
                style={
                    {
                        position: "absolute",
                        height: 40,
                        width: 40,
                        right: 7,
                        bottom: 150,
                        borderRadius: 10,
                    }
                }
                //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                colors={["#007fbb", "#00b395"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
            </LinearGradient>







            <LinearGradient style={{
                width: "22%",
                height: "11%",
                elevation: 8,
                backgroundColor: "#eee",
                borderRadius: 20
            }}

                //colors={["#99e6ae", "#009de0", "#28094d", "#00b395"]}
                colors={["#007bff", "#eee"]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 1 }}
            >
                <Image
                    source={picts.fingerprint}
                    resizeMode="center"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </LinearGradient>

            <View style={{
                width: "100%",
                height: "12%",
                justifyContent: "center",
                alignItems: "center",
                top: -20
            }}>
                <Text style={{
                    fontSize: 28,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    color: "#f0687c"
                }}>Oneci & InstaPay</Text>
            </View>

            {connected ?

                <View style={{
                    height: 50,
                    width: "90%",
                    backgroundColor: "#ffffff",
                    borderRadius: 11,
                    alignItems: 'center',
                    paddingHorizontal: "2%",
                    justifyContent: "center",
                    shadowOffset: {
                        width: 0,
                        height: 5
                    },
                    shadowOpacity: 0.4,
                    shadowColor: '#000',
                    elevation: 4
                }}>
                    <TextInput style={{
                        backgroundColor: 'transparent',
                        fontSize: 17,
                        height: 30,
                        width: "100%",
                        color: '#aaa',
                    }}
                        placeholderTextColor={'#aaa'}
                        placeholder={'Créez un code a 5 chiffres'}
                        value={pincode}
                        maxLength={5}
                        keyboardType="numeric"
                        onChangeText={text => setPincode(text)}
                    />
                </View>
                :
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
                            placeholder={'Numéro de téléphone'}
                            value={phone}
                            keyboardType="phone-pad"
                            onChangeText={text => setPhone(text)}
                        />

                        <Ionicons name="call" size={20} color={'#eee'} />
                    </View>

                    <View style={{ height: "5%" }}>

                    </View>

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
                        <View style={{ height: 30, width: 30, backgroundColor: "#eee", borderRadius: 15, padding: 3 }}>
                            <Image
                                source={picts.logo}
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
                            placeholder={'Mot de passe'}
                            value={password}
                            secureTextEntry={secure}
                            onChangeText={text => setPassword(text)}
                        />

                        <TouchableOpacity style={
                            {
                                height: 30,
                                width: 30,
                                backgroundColor: "transparent",
                                padding: 3
                            }
                        } onPress={() => setSecure(se => !se)}>
                            <Ionicons name={secure ? "eye-off" : "eye"} size={20} color={'#eee'} />

                        </TouchableOpacity>
                    </View>
                </>
            }



            <View style={{ height: "5%" }}>

            </View>
            {connected &&
                <LinearGradient
                    style={
                        {
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 1,
                            shadowColor: '#ccc',
                            elevation: 3,
                            zIndex: 20,
                            borderRadius: 17,
                            width: "40%",
                            alignSelf: "center"
                        }
                    }
                    colors={["#28094d", "#00b395"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1.5, y: 1 }}
                >
                    <TouchableOpacity
                        style={{
                            padding: 8,
                            justifyContent: "center",
                            alignItems: "center"

                        }}
                        onPress={() => saveData()}
                    >

                        <Text style={{ color: "#fff", fontWeight: "bold", letterSpacing: 5 }}>Valider</Text>

                    </TouchableOpacity>
                </LinearGradient>
            }



            {!connected &&
                <LinearGradient
                    style={
                        {
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 1,
                            shadowColor: '#ccc',
                            elevation: 3,
                            zIndex: 20,
                            borderRadius: 17,
                            width: "40%",
                            alignSelf: "center"
                        }
                    }
                    colors={["#28094d", "#00b395"]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1.5, y: 1 }}
                >
                    <TouchableOpacity
                        style={{
                            padding: 8,
                            justifyContent: "center",
                            alignItems: "center"

                        }}
                        onPress={() => Connect()}
                    >
                        {isloaded ?
                            <ActivityIndicator
                                visible={isloaded}
                                color="#fff"
                            /> :

                            <Text style={{ color: "#fff", fontWeight: "bold", letterSpacing: 5 }}>Connexion</Text>
                        }

                    </TouchableOpacity>
                </LinearGradient>
            }
        </View>

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