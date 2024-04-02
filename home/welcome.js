import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import {
    Ionicons
} from '@expo/vector-icons';
import { picts } from "../utilitis";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from "expo-linear-gradient";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default function WeLcome({ navigation }) {

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
                colors={["#f4a3af", "#00b395"]}
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
                colors={["#eee", "#007fbb"]}
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
                    color: "#f4a3af"
                }}>Oneci & InstaPay</Text>
            </View>


            <TouchableOpacity style={{
                height: 40,
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
            }} onPress={() => navigation.navigate("Connexion")}>
                <View style={{ elevation: 5, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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

                    <Text style={{ width: 10 }}>{" "}</Text>
                    <Text style={{ fontSize: 18, color: "#00b395", fontWeight: "100" }}>Connectez-vous par ici</Text>
                </View>
                <Ionicons name="log-in-outline" size={25} color={'#00b395'} />
            </TouchableOpacity>
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