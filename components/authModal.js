import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import useAuthStore from '../zustand/auth'
import authService from '../api/auth'
import VerifyEmail from './verifyEmail'
import { TouchableOpacity } from 'react-native'

const AuthModal = ({ isVisible, setIsVisible }) => {
  const [signUpPageIsOn, setSignUpPageIsOn] = useState(false)
  const [verifyPageIsOn, setVerifyPageIsOn] = useState(false)
  const backgroundColorOpacity = useRef(new Animated.Value(0)).current
  const [authInputValues, setAuthInputValues] = useState({
    email: '',
    mobileNumber: 0,
    password: '',
    confirmPassword: '',
  })
  const { setToken } = useAuthStore()

  const animatedBackgroundColor = backgroundColorOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)'],
  })
  const configureGoogleSignIn = () => {
    if (__DEV__) return
    const GoogleSignin = require('@react-native-google-signin/google-signin')
    GoogleSignin.configure({
      webClientId:
        '2779142643-r9bt2re309sdo1lu8e09hk0mudf8co7b.apps.googleusercontent.com',
    })
  }

  useEffect(() => {
    configureGoogleSignIn()
  }, [])

  const signIn = async () => {
    if (__DEV__) return
    console.log('CLICKED')
    try {
      console.log('asdasd')

      await GoogleSignin.hasPlayServices()

      const userInfo = await GoogleSignin.signIn()
      console.log('info', userInfo.data.idToken)

      authService
        .signInWithGoogle(userInfo.data.idToken)
        .then(async (res) => {
          console.log(res)
          await setToken(res.user.accessToken)
          setIsVisible(false)
          alert('Logged in successfully')
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (err) {
      console.log('err', err.message)
    }
  }

  useEffect(() => {
    if (isVisible) {
      Animated.timing(backgroundColorOpacity, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: false,
        delay: 100,
      }).start()
    } else {
      Animated.timing(backgroundColorOpacity, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start()
    }
  }, [isVisible])

  const authSubmit = () => {
    const { email, mobileNumber, password, confirmPassword } = authInputValues

    if (signUpPageIsOn) {
      authService
        .signUp(email, mobileNumber, password, confirmPassword)
        .then(() => {
          authService.sendVerifyCode(email)
          setVerifyPageIsOn(true)
        })
        .catch((err) => alert(err.response.data.message))
    } else {
      authService
        .signIn(email, password)
        .then(async (res) => {
          if (res.success) {
            await setToken(res.user.accessToken)
            setIsVisible(false)
            alert('Logged in successfully')
          }
        })
        .catch((err) => {
          if (err.response.status === 403) {
            authService.sendVerifyCode(email)
            setVerifyPageIsOn(true)
          } else {
            alert(err.response.data.message)
          }
        })
    }
  }

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(false)
      }}
    >
      <Animated.View
        style={[
          styles.modalBackground,
          { backgroundColor: animatedBackgroundColor },
        ]}
      >
        <Pressable
          style={styles.modalBackgroundPressable}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContainer}>
            <KeyboardAvoidingView
              onStartShouldSetResponder={() => true}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={100}
              style={{ position: 'relative' }}
            >
              <Text
                style={{
                  position: 'absolute',
                  right: 20,
                  top: 15,
                  fontSize: 20,
                  zIndex: 5,
                }}
                onPress={() => setIsVisible(false)}
              >
                X
              </Text>
              <>
                {verifyPageIsOn ? (
                  <VerifyEmail
                    email={authInputValues.email}
                    password={authInputValues.password}
                    setIsVisible={setIsVisible}
                    setToken={setToken}
                  />
                ) : (
                  <>
                    {signUpPageIsOn ? (
                      <>
                        <Text style={styles.modalText}>რეგისტრაცია</Text>
                        <View style={styles.modalBody}>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 20,
                              alignItems: 'center',
                              width: '100%',
                              justifyContent: 'center',
                              gap: 30,
                            }}
                          >
                            <TouchableOpacity
                              style={{ width: 50, height: 50 }}
                              onPress={signIn}
                            >
                              <Image
                                source={{
                                  uri: 'https://cdn.icon-icons.com/icons2/2642/PNG/512/google_logo_g_logo_icon_159348.png',
                                }}
                                style={{ width: 50, height: 50 }}
                              ></Image>
                            </TouchableOpacity>

                            <Image
                              source={{
                                uri: 'https://www.shareicon.net/download/2015/09/23/106011_logo_512x512.png',
                              }}
                              style={{ width: 60, height: 60 }}
                            ></Image>
                            <Image
                              source={{
                                uri: 'https://www.shareicon.net/data/2015/09/26/107391_apple_512x512.png',
                              }}
                              style={{ width: 60, height: 60 }}
                            ></Image>
                          </View>
                          <TextInput
                            label='ელ-ფოსტა'
                            mode='outlined'
                            style={{ width: '90%' }}
                            onChangeText={(text) =>
                              setAuthInputValues((prev) => ({
                                ...prev,
                                email: text,
                              }))
                            }
                          />
                          <TextInput
                            label='ტელეფონის ნომერი'
                            mode='outlined'
                            keyboardType='numeric'
                            style={{ width: '90%' }}
                            onChangeText={(text) =>
                              setAuthInputValues((prev) => ({
                                ...prev,
                                mobileNumber: text,
                              }))
                            }
                          />
                          <TextInput
                            label='პაროლი'
                            mode='outlined'
                            style={{ width: '90%' }}
                            secureTextEntry
                            onChangeText={(text) =>
                              setAuthInputValues((prev) => ({
                                ...prev,
                                password: text,
                              }))
                            }
                          />
                          <TextInput
                            label='გაიმეორეთ პაროლი'
                            mode='outlined'
                            style={{ width: '90%' }}
                            secureTextEntry
                            onChangeText={(text) =>
                              setAuthInputValues((prev) => ({
                                ...prev,
                                confirmPassword: text,
                              }))
                            }
                          />

                          <Button
                            mode='contained'
                            style={{
                              marginTop: 25,
                            }}
                            onPress={(e) => {
                              authSubmit()
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: 'MtavruliBold',
                                textTransform: 'uppercase',
                              }}
                            >
                              რეგისტრაცია
                            </Text>
                          </Button>
                          <Button onPress={() => setSignUpPageIsOn(false)}>
                            უკვე გააქვთ ანგარიში? გაიარეთ ავტორიზაცია!
                          </Button>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={styles.modalText}>ავტორიზაცია</Text>

                        <View style={styles.modalBody}>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 20,
                              alignItems: 'center',
                              width: '100%',
                              justifyContent: 'center',
                              gap: 30,
                            }}
                          >
                            <Image
                              source={{
                                uri: 'https://cdn.icon-icons.com/icons2/2642/PNG/512/google_logo_g_logo_icon_159348.png',
                              }}
                              style={{ width: 50, height: 50 }}
                            ></Image>
                            <Image
                              source={{
                                uri: 'https://www.shareicon.net/download/2015/09/23/106011_logo_512x512.png',
                              }}
                              style={{ width: 60, height: 60 }}
                            ></Image>
                            <Image
                              source={{
                                uri: 'https://www.shareicon.net/data/2015/09/26/107391_apple_512x512.png',
                              }}
                              style={{ width: 60, height: 60 }}
                            ></Image>
                          </View>
                          <TextInput
                            label='ელ-ფოსტა'
                            mode='outlined'
                            style={{ width: '90%' }}
                            onChangeText={(text) =>
                              setAuthInputValues((prev) => ({
                                ...prev,
                                email: text,
                              }))
                            }
                          />
                          <TextInput
                            label='პაროლი'
                            mode='outlined'
                            style={{ width: '90%' }}
                            secureTextEntry
                            onChangeText={(text) =>
                              setAuthInputValues((prev) => ({
                                ...prev,
                                password: text,
                              }))
                            }
                          />
                          <Button
                            mode='contained'
                            onPress={() => {
                              authSubmit()
                            }}
                            style={{ marginTop: 25 }}
                          >
                            <Text
                              style={{
                                fontFamily: 'MtavruliBold',
                                textTransform: 'uppercase',
                              }}
                            >
                              შესვლა
                            </Text>
                          </Button>
                          <Button onPress={() => setSignUpPageIsOn(true)}>
                            არ გაქვთ ანგარიში? დარეგისტრირდით!
                          </Button>
                        </View>
                      </>
                    )}
                  </>
                )}
              </>
            </KeyboardAvoidingView>
          </View>
        </Pressable>
      </Animated.View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackgroundPressable: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '90%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalBody: {
    height: '90%',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    alignItems: 'center',
    gap: 5,
  },
  modalText: {
    fontFamily: 'MtavruliBold',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
    marginTop: 14,
  },
})

export default AuthModal
