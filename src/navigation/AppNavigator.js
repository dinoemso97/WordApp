import React from 'react';
import Quiz from '../screens/Quiz';
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const AppNavigator = () =>  (
    <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
    initialRouteName="Quiz"
  >
    <Stack.Screen name="Quiz" component={Quiz} />
  </Stack.Navigator>
    )

export default AppNavigator; 

