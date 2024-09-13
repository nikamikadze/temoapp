import * as React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { View, Text, StyleSheet, Button } from 'react-native'

function Screen1() {
  return (
    <View style={[styles.container, { backgroundColor: 'red' }]}>
      <Text style={styles.text}>Screen 1</Text>
    </View>
  )
}

function Screen2() {
  return (
    <View style={[styles.container, { backgroundColor: 'blue' }]}>
      <Text style={styles.text}>Screen 2</Text>
    </View>
  )
}

function Screen3() {
  return (
    <View style={[styles.container, { backgroundColor: 'green' }]}>
      <Text style={styles.text}>Screen 3</Text>
    </View>
  )
}

function Screen4(navigation) {
  return (
    <View style={[styles.container, { backgroundColor: 'yellow' }]}>
      <Text style={styles.text}>Screen 4</Text>
      <Button onPress={() => navigation.navigate('Home')} title='Home Page' />
    </View>
  )
}

const Tab = createMaterialTopTabNavigator()

function GuideSwipes({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={{
        swipeEnabled: true,
        tabBarStyle: { display: 'none' },
        headerShown: false,
      }}
    >
      <Tab.Screen name='Screen1' component={Screen1} />
      <Tab.Screen name='Screen2' component={Screen2} />
      <Tab.Screen name='Screen3' component={Screen3} />
      <Tab.Screen name='Screen4' component={() => Screen4(navigation)} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'white',
  },
})

export default GuideSwipes
