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

const screenWidth = Dimensions.get('window').width

export default function Profile({ route, navigation }) {
  const { signOut } = useAuthStore()
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          style={{ fontSize: 20, fontWeight: 700 }}
          onPress={() => alert('123')}
        >
          ჯგუფური
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 20,
          }}
        >
          <Image
            source={{
              uri: 'https://icons.veryicon.com/png/o/miscellaneous/arrows/go-back-2.png',
            }}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>
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
  header: {
    height: 70,
    flexDirection: 'row',
    position: 'relative',
    width: screenWidth,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(170,226,255)',
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
    fontSize: 18,
  },
})
