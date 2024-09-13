import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import HomeScreen from './features/HomePage'
import GuideSwipes from './features/GuideSwipes'
import ProductDetails from './features/ProductDetails'
import { SafeAreaView } from 'react-native'

const Stack = createStackNavigator()

function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Guide'
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name='Guide' component={GuideSwipes} />
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Details' component={ProductDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default App
