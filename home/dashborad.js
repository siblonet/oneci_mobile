import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import {
    Ionicons, MaterialCommunityIcons
} from '@expo/vector-icons';
import { picts } from "../utilitis";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from "expo-linear-gradient";
import { Instapay } from '../database/database';
import { useFocusEffect } from "@react-navigation/native"
import axios from "axios";
import Cameran from './camerarunna';
import * as FileSystem from 'expo-file-system';

const HEIGHT = Dimensions.get("window").height;

const oneci = Instapay.getOneci();

export default function DashBoard({ navigation }) {
    const [isloaded, setIsLoaded] = useState(false);
    const [token, setToken] = useState();
    const [instapaytoken, setInstapaytoken] = useState();
    const [tackpi, setTackpi] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [nni, setNni] = useState();


    useFocusEffect(
        useCallback(() => {
            oneci.transaction(function (txn) {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='oneci_instapay'",
                    [],
                    function (tx, res) {
                        if (res.rows.length == 0) {
                            txn.executeSql('DROP TABLE IF EXISTS oneci_instapay', []);
                            txn.executeSql(
                                "CREATE TABLE IF NOT EXISTS oneci_instapay(id INTEGER PRIMARY KEY AUTOINCREMENT, token VARCHAR(1000), instapaytoken VARCHAR(1000))",
                                []);
                            setIsLoaded(false);
                            console.log("deleted and created");
                            navigation.navigate("Connexion");

                        } else {
                            txn.executeSql(
                                "SELECT * FROM oneci_instapay WHERE id ='1'",
                                [],
                                (tx, results) => {
                                    if (results.rows.length == 1) {

                                        setToken(results.rows._array[0].token)
                                        setInstapaytoken(results.rows._array[0].instapaytoken)

                                    } else {
                                        setIsLoaded(false)
                                    }
                                }

                            );

                        }

                    }
                );
            });

        }, [])
    );






    const verificationRequest = async () => {
        setIsLoaded(false);
        if (nni && capturedImage) {
            try {
                const base64 = await FileSystem.readAsStringAsync(capturedImage, { encoding: FileSystem.EncodingType.Base64 });

                const identity = {
                    NNI: nni,
                    BIOMETRIC_TYPE: "AUTH_FACE",
                    BIOMETRIC_TYPE: base64
                };

                const setting = { headers: { 'Authorization': `Bearer ${instapaytoken}` } };

                axios.post(`${routx.rnppUrl}/oneci/face-auth`, identity, setting).then(answ => {
                    console.log(answ.data);
                    setIsLoaded(false);
                }).catch(error => {
                    setIsLoaded(false);

                });
            } catch (error) {
                console.error("Error converting image to base64:", error);
            }

        }
    };

    return (
        <>
            {tackpi ?
                <Cameran tackpi={setTackpi} setCapturedImage={setCapturedImage} />
                :

                <LinearGradient style={hilai.container}
                    colors={["#99e6ae", "#f4a3af", "#28094d", "#f4a3af"]}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 1, y: 0 }}
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
                        width: capturedImage ? "70%" : "60%",
                        height: capturedImage ? "40%" : "45%",
                        borderRadius: capturedImage ? 25 : 120,
                        overflow: capturedImage ? "hidden" : "visible",

                    }}>
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
                                colors={["#00b395", "#28094d", "#f4a3af"]}
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
                                } onPress={() => verificationRequest()}>
                                    {isloaded ?
                                        <ActivityIndicator
                                            visible={isloaded}
                                            color="#fff"
                                        /> :

                                        <Text style={{ color: "#fff", fontSize: 18, letterSpacing: 7 }}>Vérifier</Text>
                                    }
                                </TouchableOpacity>

                            </LinearGradient>
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
                            colors={["#f4a3af", "#28094d", "#00b395"]}
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

/*useEffect(() => {
     (async () => {
         const { status } = await Camera.requestPermissionsAsync();
         setHasPermission(status === 'granted');
     })();
 }, []);

 if (!permission) requestPermission(Camera.useCameraPermissions())

 if (!permission.granted) requestPermission(Camera.useCameraPermissions())*/

/*  useFocusEffect(
      useCallback(() => {
          oneci.transaction(function (txn) {
              txn.executeSql(
                  "SELECT name FROM sqlite_master WHERE type='table' AND name='oneci_instapay'",
                  [],
                  function (tx, res) {
                      if (res.rows.length == 0) {
                          txn.executeSql('DROP TABLE IF EXISTS oneci_instapay', []);
                          txn.executeSql(
                              "CREATE TABLE IF NOT EXISTS oneci_instapay(id INTEGER PRIMARY KEY AUTOINCREMENT, token VARCHAR(1000), instapaytoken VARCHAR(1000))",
                              []);
                          setIsLoaded(false);
                          console.log("deleted and created");

                      } else {
                          txn.executeSql(
                              "SELECT * FROM oneci_instapay WHERE id ='1'",
                              [],
                              (tx, results) => {
                                  if (results.rows.length == 1) {

                                      setToken(results.rows._array[0].token)
                                      setInstapaytoken(results.rows._array[0].instapaytoken)

                                  } else {
                                      setIsLoaded(false)
                                  }
                              }

                          );

                      }

                  }
              );
          });

      }, [])
  );*/