import * as SecureStore from 'expo-secure-store'

import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  Linking,
} from 'react-native'
import useAuthStore from '../zustand/auth'
import Header from '../components/Header'
import { LinearGradient } from 'expo-linear-gradient'
import Hourglass from '../assets/hourglass.svg'
import Email from '../assets/at.svg'
import Logout from '../assets/logout.svg'
import Info from '../assets/info.svg'
import Warning from '../assets/warning.svg'
import Check from '../assets/check.svg'
import authService from '../api/auth'

const { height } = Dimensions.get('window')

export default function Profile({ route, navigation }) {
  const { signOut } = useAuthStore()
  const [userData, setUserData] = useState({})
  const [contactModalOpened, setContactModalOpened] = useState(false)
  const [rulesModalOpened, setRulesModalOpened] = useState(false)

  const handleCloseModal = () => {
    setContactModalOpened(false)
    setRulesModalOpened(false)
  }

  const handleEmail = () => {
    Linking.openURL('mailto:contact@example.com')
  }

  const handlePhone = () => {
    Linking.openURL('tel:+0322222222')
  }

  const handleFacebook = () => {
    Linking.openURL('https://www.facebook.com/jgupuri')
  }

  useEffect(() => {
    async function fetchUserData() {
      authService.getProfile().then((res) => {
        console.log(res.mobileNumber)

        setUserData({ email: res.email, number: res.mobileNumber })
      })
    }

    fetchUserData()
  }, [])

  return (
    <View style={styles.container}>
      <Header navigation={navigation} hasRightIcon={false} />
      <LinearGradient
        colors={['#0C969C', '#0C969C', '#032F30']}
        style={styles.background}
      />
      <View style={{ flexDirection: 'row', margin: 20 }}>
        <Image
          source={require('../assets/profile.png')}
          style={{ width: 100, height: 100 }}
        />
        <View style={{ justifyContent: 'center', height: 100, gap: 10 }}>
          <Text style={styles.infoText}>{userData.email}</Text>
          <Text style={styles.infoText}>{userData.number}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.category, { marginTop: 20 }]}
        onPress={() => {
          navigation.navigate('DealHistory', {
            category: 'active',
          })
        }}
      >
        <Hourglass height={35} />
        <Text style={styles.categoryText}>მიმდინარე ჯგუფურები</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.category}
        onPress={() => {
          navigation.navigate('DealHistory', {
            category: 'completed',
          })
        }}
      >
        <Check height={35} />
        <Text style={styles.categoryText}>წარმატებული ჯგუფურები</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.category}
        onPress={() => {
          navigation.navigate('DealHistory', {
            category: 'canceled',
          })
        }}
      >
        <Warning height={35} />
        <Text style={styles.categoryText}>წარუმატებელი ჯგუფურები</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.category, { marginTop: 100 }]}
        onPress={() => setContactModalOpened(true)}
      >
        <Email height={35} />
        <Text style={styles.categoryText}>კონტაქტი</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.category}
        onPress={() => setRulesModalOpened(true)}
      >
        <Info height={35} />
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
        <Logout height={35} />
        <Text style={styles.categoryText}>გასვლა</Text>
      </TouchableOpacity>
      <Modal
        animationType='slide'
        transparent={true}
        visible={contactModalOpened || rulesModalOpened}
        onRequestClose={handleCloseModal}
      >
        <View
          style={{
            justifyContent: 'flex-end',
            height: '100%',
          }}
        >
          <View style={[styles.modalContainer, { height: height * 0.7 }]}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={{
                position: 'absolute',
                top: 30,
                right: 30,
                height: 40,
                width: 40,
              }}
            >
              <Text
                style={{
                  margin: 'auto',
                  fontSize: 25,
                  color: 'white',
                }}
              >
                X
              </Text>
            </TouchableOpacity>
            {contactModalOpened && (
              <>
                <Text style={styles.modalTitle}>შეგვეხმიანე</Text>

                <TouchableOpacity
                  onPress={handlePhone}
                  style={styles.modalItem}
                >
                  <Image
                    source={require('../assets/phone.png')}
                    style={{ width: 40, height: 40 }}
                  />
                  <Text style={styles.modalText}> 03 22 222 222</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleEmail}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalText}> info@jgupuri.ge</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleFacebook}
                  style={styles.modalItem}
                >
                  <Image
                    source={require('../assets/fb.png')}
                    style={{ width: 40, height: 40 }}
                  />
                  <Text style={styles.modalText}> @jgupuri</Text>
                </TouchableOpacity>
              </>
            )}
            {rulesModalOpened && (
              <>
                <Text style={styles.modalTitle}>წესები და პირობები</Text>
                <Text style={{ color: 'white' }}>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Dignissimos doloribus, nihil natus ex suscipit fuga alias,
                  ipsam consequuntur enim soluta culpa deleniti magni expedita
                  beatae, nobis eius atque aperiam! Animi autem, laborum porro
                  impedit expedita voluptate nisi voluptatibus possimus vitae
                  molestiae repellendus ullam. Nesciunt cupiditate eligendi
                  eveniet, consequuntur similique magni quidem facilis eaque
                  possimus quisquam harum, optio molestias exercitationem
                  distinctio.
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27aae2',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 70,
    height: height - 70,
  },
  infoText: {
    fontSize: 18,
    fontFamily: 'MtavruliBold',
    color: 'white',
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '90%',
    margin: 'auto',
    marginVertical: 5,
    borderRadius: 20,
    padding: 15,
    backgroundColor: '#274D60',
  },
  categoryText: {
    marginLeft: 10,
    width: '100%',
    fontSize: 18,
    color: 'white',
    textTransform: 'uppercase',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#274D60',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden', // Prevents content from overflowing
  },
  modalTitle: {
    fontSize: 28,
    fontFamily: 'MtavruliBold',
    textTransform: 'uppercase',
    marginBottom: 60,
    color: 'white',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '50%',
  },
  modalText: {
    fontSize: 18,
    marginLeft: 5,
    color: '#fff',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
})
