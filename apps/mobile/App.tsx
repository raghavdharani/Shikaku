import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/HomeScreen';
import PuzzleScreen from './screens/PuzzleScreen';
import AppScreenSkeleton from './screens/AppScreenSkeleton';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Puzzle" component={PuzzleScreen} />
        <Tab.Screen name="Stats" children={() => <AppScreenSkeleton title="Stats" />} />
        <Tab.Screen name="Settings" children={() => <AppScreenSkeleton title="Settings" />} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
