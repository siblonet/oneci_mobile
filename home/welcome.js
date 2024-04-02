import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import {
    Ionicons
} from '@expo/vector-icons';
import { picts } from "../utilitis";
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from "expo-linear-gradient";


export default function WeLcome({ navigation }) {

    return (
        <View style={hilai.container}>
            <StatusBar animated={true} style="light" backgroundColor="#1d191a" />
            <View style={{
                width: "59%",
                height: "35%",
            }}>
                <Image
                    source={picts.logo}
                    resizeMode="center"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </View>

            <View style={{
                width: "79%",
                height: "12%",
                top: -30
            }}>
                <Text>Login</Text>
            </View>



            <View style={{
                width: "90%",
                height: "5%",
                backgroundColor: "#1d191a",
                alignItems: "center",
                justifyContent: "center"
            }}>

            </View>
            <TouchableOpacity style={{
                height: 40,
                width: "90%",
                backgroundColor: "#ffffff",
                borderRadius: 11,
                alignItems: 'center',
                flexDirection: 'row',
                paddingRight: "2%",
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

                    <LinearGradient
                        style={
                            {
                                borderRadius: 10,
                                padding: 3
                            }
                        }
                        colors={["#6fcaea", "#99e6ae"]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1.5, y: 1 }}
                    >
                        <Ionicons name="person-circle-outline" size={32} color={'#1d191a'} />
                    </LinearGradient>

                    <Text style={{ width: 10 }}>{" "}</Text>
                    <Text style={{ fontSize: 18, color: "#1d191a", fontWeight: "bold" }}>Connectez-vous par ici</Text>
                </View>
                <Ionicons name="log-in-outline" size={25} color={'#1d191a'} />
            </TouchableOpacity>
        </View>

    )
}

const hilai = StyleSheet.create({
    container: {
        backgroundColor: '#1d191a',
        height: "100%",
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'scroll'
    },

});