import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import GuideSwipes from './features/GuideSwipes'
import ProductDetails from './features/ProductDetails'
import React, { useState } from 'react'
import { StatusBar, StyleSheet, View, SafeAreaView } from 'react-native'
import ChcekoutPage from './features/CheckoutPage'

const Stack = createStackNavigator()

function App() {
  const [hasSeenGuide, setHasSeenGuide] = useState(false)

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='rgb(170,226,255)' />

      <SafeAreaView style={styles.topSafeArea} />

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
            <Stack.Screen name='Checkout' component={ChcekoutPage} />
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
