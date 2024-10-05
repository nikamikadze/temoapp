import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import GuideSwipes from './features/GuideSwipes'
import ProductDetails from './features/ProductDetails'
import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, View, SafeAreaView } from 'react-native'
import ChcekoutPage from './features/CheckoutPage'
import Profile from './features/Profile'
import HomePage from './features/HomePage'
import DealHistory from './features/DealHistory'
import useAuthStore from './zustand/auth'

const Stack = createStackNavigator()

function App() {
  const [hasSeenGuide, setHasSeenGuide] = useState(false)
  const [topAreaColor, setTopAreaColor] = useState('rgb(170,226,255)')
  const { checkLoginStatus } = useAuthStore()

  useEffect(() => {
    checkLoginStatus()
  }, [])

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='rgb(170,226,255)' />

      <SafeAreaView style={{ backgroundColor: topAreaColor }} />
      {/* for iphone */}

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
                  setTopAreaColor={setTopAreaColor}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name='DealList'>
              {(props) => <HomePage {...props} isDisplayed={true} />}
            </Stack.Screen>
            <Stack.Screen name='Details' component={ProductDetails} />
            <Stack.Screen name='Checkout' component={ChcekoutPage} />
            <Stack.Screen name='Profile' component={Profile} />
            <Stack.Screen name='DealHistory' component={DealHistory} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(170,226,255)',
  },
})

export default App
