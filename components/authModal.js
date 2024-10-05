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
                        <Text style={styles.modalText}>Sign Up</Text>
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
                            label='Email'
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
                            label='Mobile Number'
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
                            label='Password'
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
                            label='Confirm Password'
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
                            style={{ marginTop: 25 }}
                            onPress={(e) => {
                              authSubmit()
                            }}
                          >
                            Sign Up
                          </Button>
                          <Button onPress={() => setSignUpPageIsOn(false)}>
                            Already have an account? Sign in!
                          </Button>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={styles.modalText}>Sign in</Text>

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
                            label='Email'
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
                            label='Password'
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
                            Log In
                          </Button>
                          <Button onPress={() => setSignUpPageIsOn(true)}>
                            Don't have account? Sign Up!
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
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
    marginTop: 14,
  },
})

export default AuthModal
