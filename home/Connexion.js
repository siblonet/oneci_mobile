import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, Platform, KeyboardAvoidingView, ScrollView, ImageBackground, Dimensions, Alert, TouchableOpacity, Keyboard, Linking} from 'react-native';
import axios from "axios";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Memory } from './log_save/memory';
import { picts, routx } from "./medialink";
import { thisiswhat, whatisthis } from "./boutik/convertisseur";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants'


const courier = Memory.getCourier();


const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;


export default function ConneXion({ navigation }) {
    const [isLoaded, setIsLoaded] = useState(false);

    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();


    const [notif, setNotif] = useState("denied");



    const [secureb, setSecureb] = useState(true);
    const [securec, setSecurec] = useState(true);





    useFocusEffect(
        useCallback(() => {
            (async () => {
                registerForPushNotificationsAsync().then(secro => {
                    if (secro !== "denied") {
                        setNotif(secro);
                    } else {
                        setNotif("denied");
                            if (Platform.OS === 'ios') {
                                Linking.openURL();
                            } else {
                                Linking.openSettings();
                            }
                    }
                }).catch((ee) => {
                    alert(
                        "FCM APNS GENERING" + ee
                    );
                });
            })();

        }, []));





    const LoginSession = async () => {
        setIsLoaded(true)
        Keyboard.dismiss();

        const person = {
            phone: phone,
            motdepass: password,
        };


        if (phone !== undefined && password !== undefined && phone !== "" && password !== "") {
            axios.post(`${routx.tunal}/people/login/nuance`, person).then(answ => {
                if (answ.data.token) {
                    const splo = answ.data.token.split("°");

                    const _id = splo[0];
                    const prenom = splo[1];
                    const nom = splo[2];
                    const phone = splo[3];
                    const email = splo[4];
                    const isStaff = splo[5];
                    const isAdmin = splo[6];
                    const admin = thisiswhat(`${isAdmin}`);
                    const staff = thisiswhat(`${isStaff}`);
                    const id = thisiswhat(`${_id}`);
                    if (admin == "true" || staff == "true") {
                        /*const setting = {
                            headers: { 'Authorization': `Bearer ${script}` }
                        };
                
                    
                
                        axios.put(`${routx.tunal}/auth/ua/${my_id}@${routx.enda}/`, toupdate, setting).then(() => {*/
                        //const dee = "ExponentPushToken[jBJakFDpXj9FAP3j-Je57I]";
                        //notif
                        axios.put(`${routx.tunal}/people/pushtoken/${id}`, { notif: `${notif}` }).then(answ => {
                            if (answ.data.wrong == "ok") {
                                courier.transaction(function (tx) {
                                    tx.executeSql(
                                        'INSERT INTO boutik_admin(_id, prenom, nom, email, phone, staff, admin) VALUES (?,?,?,?,?,?,?)',
                                        [_id, prenom, nom, email, phone, isStaff, isAdmin],
                                        (tx, results) => {
                                            if (results.rowsAffected > 0) {
                                                setIsLoaded(false);
                                                navigation.navigate("Home");
                                            } else alert('There was an error during the Creation !!!');
                                        }
                                    );
                                });
                            }
                        }).catch(error => {
                            setIsLoaded(false);
                            Alert.alert("Information Rejetée", "Veillez saisir correctement vos identifiants");

                        });
                    } else {
                        Alert.alert("Information Rejetée", "Vous n'etes pas Adminitrateur");
                        setIsLoaded(false);

                    }

                } else {
                    Alert.alert("Information Rejetée", "Veillez saisir correctement vos identifiants");
                    setIsLoaded(false);

                }
            })
                .catch(error => {
                    setIsLoaded(false);
                    console.log("error", error);
                    Alert.alert("Information Rejetée", "Veillez saisir correctement vos identifiants");

                });
        } else {
            setIsLoaded(false)

        }


    };


    async function registerForPushNotificationsAsync() {
        let secro = "denied";
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            };
            if (finalStatus !== 'granted') {
                return "denied";
            };
            secro = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig.extra.eas.projectId
            });
        }
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return secro.data;
    };



    return (
        <ImageBackground source={picts.logo} blurRadius={20} style={{ height: HEIGHT, width: WIDTH, backgroundColor: "#1d191a" }}>
            <StatusBar animated={true} style="light" backgroundColor="transparent" />

            <KeyboardAvoidingView style={{ alignItems: "center" }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

                <ScrollView showsVerticalScrollIndicator={false} style={hilai.container}>
                    <View style={{ height: Platform.OS === "ios" ? 30 : 20 }}></View>
                    <View style={{ alignItems: "center"}}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{
                                paddingHorizontal: 7,
                                borderRadius: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center',
                                height: 25,
                                width: 70,
                                backgroundColor: 'transparent',
                            }} onPress={() => navigation.goBack()}>
                                <View style={{
                                    backgroundColor: '#1d191a',
                                    position: 'absolute',
                                    height: "100%",
                                    width: 70,
                                    borderRadius: 5,
                                    opacity: 0.3,
                                    shadowOffset: {
                                        width: 0,
                                        height: 5
                                    },
                                    shadowOpacity: 0.7,
                                    shadowColor: '#000',
                                    elevation: 5
                                }}>

                                </View>
                                <MaterialCommunityIcons name='chevron-double-left' style={{ elevation: 7 }} size={20} color={'#FFF'} />
                                <Text style={{ color: '#FFF', fontSize: 12, elevation: 7 }}>Back</Text>
                            </TouchableOpacity>

                            <View style={{ width: 20 }}></View>

                            <TouchableOpacity style={{
                                height: 25,
                                width: 70,
                                backgroundColor: 'transparent',
                                paddingHorizontal: 7,
                                borderRadius: 5,
                                flexDirection: 'row',
                                justifyContent: 'space-around',
                                alignItems: 'center'
                            }}>
                                <View style={{
                                    backgroundColor: '#1d191a',
                                    position: 'absolute',
                                    height: "100%",
                                    width: 70,
                                    borderRadius: 5,
                                    opacity: 0.3,
                                    shadowOffset: {
                                        width: 0,
                                        height: 5
                                    },
                                    shadowOpacity: 0.7,
                                    shadowColor: '#000',
                                    elevation: 5
                                }}>

                                </View>
                                <Text style={{ color: '#FFF', fontSize: 12, elevation: 7 }}>Aide</Text>
                                <MaterialCommunityIcons name='chevron-double-right' style={{ elevation: 7 }} size={20} color={'#FFF'} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: 50 }}></View>

                        <View style={hilai.logo}>
                            <Ionicons name='person' size={70} color={'#FFF'} style={{ width: 100, height: 100, top: 20, left: 20 }} />
                        </View>

                        <View style={hilai.inpuCon}>
                            <View style={hilai.tranparenca}>

                            </View>
                            <TextInput style={hilai.input} placeholder={"Numéro de téléphone"} value={phone} onChangeText={text => setPhone(text)} />
                            <Ionicons style={hilai.icons} name="call-outline" size={20} color={'#FFF'} />
                        </View>


                        <View style={hilai.space}><Text>{""}</Text></View>


                        <View style={hilai.inpuCon}>
                            <View style={hilai.tranparenca}>

                            </View>
                            <TextInput style={hilai.input} secureTextEntry={securec} placeholder={"Mot de passe"} value={password} onChangeText={text => setPassword(text)} />

                            <Ionicons style={hilai.icons} name={securec ? "eye-off" : "eye"} size={20} color={'#FFF'} onPress={() => setSecurec((r) => !r)} />
                        </View>
                        <View style={hilai.space}><Text>{""}</Text></View>

                        <TouchableOpacity disabled={isLoaded} style={hilai.soumet} onPress={() => LoginSession()}>
                            {isLoaded ?
                                <ActivityIndicator
                                    visible={isLoaded}
                                    color="#fff"
                                />
                                :

                                <Ionicons style={{
                                    shadowOffset: {
                                        width: 1,
                                        height: 5
                                    },
                                    shadowOpacity: 0.5,
                                    shadowColor: '#000',

                                }} name="lock-closed" size={20} color={'white'} />
                            }

                            <Text style={{ fontWeight: 'bold', fontSize: 17, color: 'white', right: 20 }}>Je me connecte</Text>
                        </TouchableOpacity>



                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

        </ImageBackground>
    );
};


const hilai = StyleSheet.create({
    container: {
        width: "100%",
        paddingHorizontal: "5%",
        alignSelf: "center",
        height: "100%",
        paddingVertical: "5%"
    },
    logo: {
        backgroundColor: '#1d191a',
        width: 100,
        height: 100,
        borderRadius: 50,
        borderTopWidth: 10,
        borderStartWidth: 7,
        borderColor: '#c0a558',
        paddingBottom: 100,
        marginBottom: 50,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.3,
        shadowColor: '#000'
    },
    inpuCon: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignSelf: "center",
        width: "100%",
        height: 50
    },
    tranparenca: {
        backgroundColor: '#c0a558',
        elevation: 8,
        position: 'absolute',
        borderRadius: 50,
        width: "100%",
        height: "100%",
        opacity: 0.5,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.7,
        shadowColor: '#000',
        zIndex: 0
    },
    input: {
        backgroundColor: 'transparent',
        fontSize: 20,
        alignSelf: "center",
        borderRadius: 50,
        width: "100%",
        height: "100%",
        color: '#1d191a',
        fontWeight: "bold",
        paddingHorizontal: 20,
        zIndex: 3,
        letterSpacing: 2
    },

    space: {
        height: 50
    },

    soumet: {
        backgroundColor: '#1d191a',
        width: 200,
        height: 50,
        borderRadius: 50,
        borderTopWidth: 10,
        borderStartWidth: 7,
        paddingHorizontal: 10,
        borderColor: '#c0a558',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.3,
        elevation: 7,
        shadowColor: '#000',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },

    icons: {
        right: 30,
        shadowOffset: {
            width: 1,
            height: 5
        },
        shadowOpacity: 0.5,
        shadowColor: '#000',
        zIndex: 5,
        elevation: 9,
    },
});
