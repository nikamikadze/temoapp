import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import GuideSwipes from './features/GuideSwipes'
import ProductDetails from './features/ProductDetails'
import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, View, SafeAreaView, Text } from 'react-native'
import ChcekoutPage from './features/CheckoutPage'
import Profile from './features/Profile'
import HomePage from './features/HomePage'
import DealHistory from './features/DealHistory'
import useAuthStore from './zustand/auth'
import * as Font from 'expo-font'
import AuthModal from './components/authModal'

const Stack = createStackNavigator()

function App() {
  const [hasSeenGuide, setHasSeenGuide] = useState(false)
  const [topAreaColor, setTopAreaColor] = useState('#0A7075')
  const {
    checkLoginStatus,
    isSignedIn,
    isSignInModalVisible,
    showSignInModal,
  } = useAuthStore()
  const [loading, setLoading] = useState(true)

  const loadFonts = async () => {
    await Font.loadAsync({
      Mtavruli: require('./assets/fonts/Mtavruli.ttf'),
      MtavruliBold: require('./assets/fonts/Mtavruli-Bold.ttf'),
    })
  }

  useEffect(() => {
    loadFonts()
    const fetchLoginStatus = async () => {
      await checkLoginStatus()
      setLoading(false)
    }
    fetchLoginStatus()
  }, [])

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <>
      <AuthModal
        isVisible={isSignInModalVisible}
        setIsVisible={showSignInModal}
      />
      <StatusBar barStyle='ligh-content' backgroundColor='#0A7075' />

      <SafeAreaView style={{ backgroundColor: topAreaColor }} />
      {/* for iphone */}

      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isSignedIn ? 'DealList' : 'Guide'}
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
    backgroundColor: '#0A7075',
  },
})

export default App
