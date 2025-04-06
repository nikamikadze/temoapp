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
import AsyncStorage from '@react-native-async-storage/async-storage'
import ResetPassword from './resetPassword'
// import { GoogleSignin } from '@react-native-google-signin/google-signin'

const AuthModal = ({ isVisible, setIsVisible }) => {
  const [forgotPasswordPageIsOn, setForgotPasswordPageIsOn] = useState(false)
  const [resetStage, setResetStage] = useState('email')
  const [resetInputs, setResetInputs] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmNewPassword: '',
  })
  const [signUpPageIsOn, setSignUpPageIsOn] = useState(false)
  const [verifyPageIsOn, setVerifyPageIsOn] = useState(false)
  const backgroundColorOpacity = useRef(new Animated.Value(0)).current
  const [authInputValues, setAuthInputValues] = useState({
    email: '',
    mobileNumber: 0,
    password: '',
    confirmPassword: '',
  })
  const { setToken, setInfo } = useAuthStore()

  const animatedBackgroundColor = backgroundColorOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)'],
  })
  const configureGoogleSignIn = async () => {
    // if (__DEV__) return
    // const GoogleSignin =
    //   await require('@react-native-google-signin/google-signin')
    GoogleSignin.configure({
      webClientId:
        '2779142643-r9bt2re309sdo1lu8e09hk0mudf8co7b.apps.googleusercontent.com',
    })
  }

  useEffect(() => {
    // configureGoogleSignIn()
    console.log(123123)
  }, [])

  const signIn = async () => {
    if (__DEV__) return
    try {
      await GoogleSignin.hasPlayServices()

      const notificationToken = await AsyncStorage.getItem('expoPushToken')
      const userInfo = await GoogleSignin.signIn()
      authService
        .signInWithGoogle(userInfo.data.idToken, notificationToken)
        .then(async (res) => {
          console.log(res)
          await setToken(res.user.accessToken)
          setInfo(res.user.email, res.user.mobileNumber)
          setIsVisible(false)
          alert('წარმატებით შეხვედით')
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

  const sendResetCode = async (email) => {
    console.log(email)

    try {
      console.log(email)

      const res = await authService.sendPasswordResetCode(email)
      console.log(res)
    } catch (err) {
      console.log(err.data)

      alert('კოდი ვერ გაიგზავნა')
    }
  }

  const authSubmit = async () => {
    const { email, mobileNumber, password, confirmPassword } = authInputValues
    const notificationToken = await AsyncStorage.getItem('expoPushToken')

    if (signUpPageIsOn) {
      if (password !== confirmPassword) {
        alert('პაროლები არ ემთხვევა')
        return
      }
      authService
        .signUp(email, mobileNumber, password, notificationToken)
        .then(() => {
          authService.sendVerifyCode(email)
          setVerifyPageIsOn(true)
        })
        .catch((err) => alert(err.response.data.message))
    } else {
      console.log('login', notificationToken)

      authService
        .signIn(email, password, notificationToken)
        .then(async (res) => {
          console.log('login', res)

          if (res.success) {
            await setToken(res.user.accessToken)
            setInfo(res.user.email, res.user.mobileNumber)
            setIsVisible(false)
            alert('წარმატებით შეხვედით')
          }
        })
        .catch((err) => {
          console.log(err)

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
                {forgotPasswordPageIsOn ? (
                  <>
                    <Text style={styles.modalText}>პაროლის აღდგენა</Text>
                    <View style={styles.modalBody}>
                      {resetStage === 'email' ? (
                        <>
                          <TextInput
                            label='ელ-ფოსტა'
                            mode='outlined'
                            style={{ width: '90%' }}
                            value={resetInputs.email}
                            onChangeText={(text) =>
                              setResetInputs((prev) => ({
                                ...prev,
                                email: text,
                              }))
                            }
                          />
                          <Button
                            mode='contained'
                            onPress={() => {
                              sendResetCode(resetInputs.email)
                              setResetStage('code')
                            }}
                            style={{ marginTop: 25 }}
                          >
                            კოდის გაგზავნა
                          </Button>
                        </>
                      ) : (
                        <ResetPassword
                          email={resetInputs.email}
                          successHandler={() => {
                            setResetInputs({
                              email: '',
                              password: '',
                              confirmPassword: '',
                            })
                            setForgotPasswordPageIsOn(false)
                            setSignUpPageIsOn(false)
                          }}
                        />
                      )}
                      <Button
                        onPress={() => {
                          setForgotPasswordPageIsOn(false)
                          setResetStage('email')
                        }}
                        style={{ marginTop: 10 }}
                      >
                        უკან დაბრუნება
                      </Button>
                    </View>
                  </>
                ) : verifyPageIsOn ? (
                  <VerifyEmail
                    email={authInputValues.email}
                    password={authInputValues.password}
                    hideModal={() => {
                      setIsVisible(false)
                      setVerifyPageIsOn(false)
                    }}
                    setToken={setToken}
                    setInfo={setInfo}
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
                              // onPress={signIn}
                            >
                              <Image
                                source={require('../assets/googleicon.webp')}
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
                          <TouchableOpacity
                            onPress={() => {
                              setForgotPasswordPageIsOn(true)
                              setResetStage('email')
                              setResetInputs({
                                email: '',
                                code: '',
                                newPassword: '',
                                confirmNewPassword: '',
                              })
                            }}
                          >
                            <Text style={{ color: '#007AFF', marginTop: 10 }}>
                              დაგავიწყდა პაროლი?
                            </Text>
                          </TouchableOpacity>
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
