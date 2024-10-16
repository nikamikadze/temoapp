import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native'
import useAuthStore from '../zustand/auth'
import Header from '../components/Header'

const screenWidth = Dimensions.get('window').width

export default function Profile({ route, navigation }) {
  const { signOut } = useAuthStore()
  return (
    <View style={styles.container}>
      <Header navigation={navigation} hasRightIcon={false} />
      <Text style={[styles.infoText, { marginTop: 20 }]}>
        სახელი: Nika Mikadze
      </Text>
      <Text style={styles.infoText}>ელ-ფოსტა: nikamikadze123@gmail.com</Text>
      <Text style={styles.infoText}>ნომერი: 555-555-555</Text>
      <TouchableOpacity
        style={[styles.category, { marginTop: 20 }]}
        onPress={() => {
          navigation.navigate('DealHistory', {
            category: 'active',
          })
        }}
      >
        <Text style={styles.categoryText}>მიმდინარე შეთავაზებები</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.category}
        onPress={() => {
          navigation.navigate('DealHistory', {
            category: 'completed',
          })
        }}
      >
        <Text style={styles.categoryText}>წარმატებული შეთავაზებები</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.category}
        onPress={() => {
          navigation.navigate('DealHistory', {
            category: 'canceled',
          })
        }}
      >
        <Text style={styles.categoryText}>წარუმატებელი შეთავაზებები</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.category, { marginTop: 100 }]}>
        <Text style={styles.categoryText}>კონტაქტი</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.category}>
        <Text style={styles.categoryText}>წესები და პირობები</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.category}
        onPress={async () => {
          await SecureStore.deleteItemAsync('accessToken')
          navigation.navigate('DealList')
          signOut()
          alert('you are logged out')
        }}
      >
        <Text style={styles.categoryText}>გასვლა</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27aae2',
  },
  infoText: { fontSize: 16, marginLeft: 10, marginBottom: 10 },
  category: {
    flexDirection: 'row',
    width: '90%',
    margin: 5,
    borderWidth: 2,
    borderRadius: 20,
    padding: 15,
  },
  categoryText: {
    textAlign: 'center',
    width: '100%',
    fontSize: 18,
    textTransform: 'uppercase',
  },
})
