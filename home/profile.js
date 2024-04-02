export default function Profile({ navigation }) {


    return (
        <ImageBackground source={picts.shadowb} fadeDuration={2000} style={hilai.container}>
            <StatusBar animated={true} style="light" backgroundColor="transparent" />
            <View style={{ height: HEIGHT, width: WIDTH, position: 'absolute', backgroundColor: '#2a2d31', opacity: 0.8 }}>
            </View>

        </ImageBackground>

    )

};


