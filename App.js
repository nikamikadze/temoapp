import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import GuideSwipes from './features/GuideSwipes'
import ProductDetails from './features/ProductDetails'
import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar, StyleSheet, View, SafeAreaView } from 'react-native'

const Stack = createStackNavigator()

function App() {
  const [hasSeenGuide, setHasSeenGuide] = useState(false)

  return (
    <>
      {/* StatusBar with background color */}
      <StatusBar barStyle='dark-content' backgroundColor='#27aae2' />

      {/* SafeAreaView to respect the status bar on top only */}
      <SafeAreaView style={styles.topSafeArea} />

      {/* Main content without SafeAreaView to allow FlatList to extend to the bottom */}
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName='Guide'
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name='Guide'>
              {(props) => (
                <GuideSwipes
                  {...props}
                  hasSeenGuide={hasSeenGuide}
                  setHasSeenGuide={setHasSeenGuide}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name='Details' component={ProductDetails} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  topSafeArea: {
    backgroundColor: 'rgb(170,226,255)',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(170,226,255)',
  },
})

export default App
