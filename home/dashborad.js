import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import {
    Ionicons
} from '@expo/vector-icons';
import { picts } from "../utilitis";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from "expo-linear-gradient";
import { Instapay } from '../database/database';
import { useFocusEffect } from "@react-navigation/native"
import axios from "axios";

const HEIGHT = Dimensions.get("window").height;

const oneci = Instapay.getOneci();

export default function DashBoard({ navigation }) {
    const [isloaded, setIsLoaded] = useState(false);
    const [token, setToken] = useState();
    const [instapaytoken, setInstapaytoken] = useState();
    const [tackpi, setTackpi] = useState(false);


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


    return (
        <>
            {tackpi ?
                <View style={{}}>

                </View>
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
                        width: "60%",
                        height: "45%",
                        borderRadius: 120,
                    }}>
                        <Image
                            source={picts.faceid}
                            resizeMode="center"
                            style={{
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </View>

                    <View style={{ height: 50 }}>
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
                        } onPress={() => navigation.navigate("Cameran")}>
                            <Text style={{ color: "#fff", fontSize: 18, letterSpacing: 7 }}>Procéder</Text>
                        </TouchableOpacity>

                    </LinearGradient>

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