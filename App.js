import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ConneXion, DashBoard, Cameran } from './home';

const Page = createStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Page.Navigator initialRouteName='Home'>
        <Page.Screen
          name="Home"
          component={DashBoard}
          options={{
            headerShown: false
          }}
        />

        <Page.Screen
          name="Connexion"
          component={ConneXion}
          options={{
            headerShown: false
          }}
        />


        <Page.Screen
          name="Cameran"
          component={Cameran}
          options={{
            headerShown: false
          }}
        />
      </Page.Navigator>
    </NavigationContainer>
  );
}