import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import {LoadingPage, WeLcome, } from './home';

const Page = createStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Page.Navigator initialRouteName='Home'>
        <Page.Screen
          name="Home"
          component={WeLcome}
          options={{
            headerShown: false
          }}
        />

        <Page.Screen
          name="loading"
          component={LoadingPage}
          options={{
            headerShown: false
          }}
        />
      </Page.Navigator>
    </NavigationContainer>
  );
}