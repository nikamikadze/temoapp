import * as Notifications from 'expo-notifications'
import * as Linking from 'expo-linking'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert, Platform } from 'react-native'
import Constants from 'expo-constants'
import * as Device from 'expo-device'

export async function registerForPushNotifications() {
  const storedToken = await AsyncStorage.getItem('expoPushToken')
  console.log(storedToken)

  if (storedToken) {
    return storedToken
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    console.log('existing', existingStatus)

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }

    console.log('requested', finalStatus)

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Enable Notifications',
        'To receive notifications, please enable permissions in your device settings.',
        [
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      )
      return
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId

      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data

      await AsyncStorage.setItem('expoPushToken', token)
    } catch (error) {
      console.error('Failed to get or save push token:', error)
    }
  } else {
    Alert.alert('Must use physical device for push notifications')
  }
}
