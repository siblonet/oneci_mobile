import React from 'react';
import { StyleSheet, View, Image, Dimensions, Text } from 'react-native';
import { picts } from "../utilitis";



const HEIGHT = Dimensions.get('window').height;

export default function LoadingPage() {

    return (
        <View style={hilai.container}>
            <View style={{
                height: 200,
                width: 300,
                alignSelf: "center",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                borderRadius: 20,
                overflow: "hidden"
            }}>
                <Image
                    source={picts.loadingc}
                    resizeMode="contain"
                    style={{
                        width: "105%",
                        height: "150%",
                        alignSelf: 'center'
                    }}
                />

            </View>
            <View style={{ paddingVertical: 5 }}>
                <Text style={{ fontSize: 14, color: "#007bff", alignSelf: "center", fontWeight: "200" }}>En cours de vérification ... </Text>

            </View>
        </View>

    )
}

const hilai = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: HEIGHT,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'scroll'
    },

});