import React, { useState, useRef, useEffect } from 'react'
import {
  Modal,
  Pressable,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native'
import { Button, TextInput } from 'react-native-paper'

const MyModal = ({ isOpen, setIsOpen, setIsSignedIn }) => {
  const [signUpPageIsOn, setSignUpPageIsOn] = useState(true)
  const opacity = useRef(new Animated.Value(0)).current // Initial opacity

  // useEffect(() => {
  //   if (isOpen) {
  //     Animated.timing(opacity, {
  //       toValue: 0.5, // Set the desired opacity for the blur effect
  //       duration: 300, // Duration of the fade-in
  //       useNativeDriver: true,
  //     }).start()
  //   } else {
  //     Animated.timing(opacity, {
  //       toValue: 0, // Fade out when modal is closed
  //       duration: 300,
  //       useNativeDriver: true,
  //     }).start()
  //   }
  // }, [isOpen])

  return (
    <>
      <Modal
        transparent={true}
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
        animationType='none' // No animation for modal itself
      >
        <Animated.View style={[styles.modalBackground, { opacity }]}>
          <Pressable
            style={styles.modalBackground}
            onPress={() => setIsOpen(false)}
          >
            <KeyboardAvoidingView
              style={styles.modalContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Adjust offset as needed
            >
              {signUpPageIsOn ? (
                <>
                  <Text style={styles.modalText}>Sign Up</Text>
                  <View style={styles.modalBody}>
                    <TextInput
                      label='Email'
                      mode='outlined'
                      style={{ width: '90%' }}
                    />
                    <TextInput
                      label='Mobile Number'
                      mode='outlined'
                      keyboardType='numeric'
                      style={{ width: '90%' }}
                    />
                    <TextInput
                      label='Password'
                      mode='outlined'
                      style={{ width: '90%' }}
                      secureTextEntry
                    />
                    <TextInput
                      label='Confirm Password'
                      mode='outlined'
                      style={{ width: '90%' }}
                      secureTextEntry
                    />
                    <Button
                      mode='contained'
                      style={{ marginTop: 25 }}
                      onPress={() => {
                        setIsSignedIn(true)
                        setIsOpen(false)
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
                    <TextInput
                      label='Email'
                      mode='outlined'
                      style={{ width: '90%' }}
                    />
                    <TextInput
                      label='Password'
                      mode='outlined'
                      style={{ width: '90%' }}
                      secureTextEntry
                    />
                    <Button
                      mode='contained'
                      onPress={() => {
                        setIsSignedIn(true)
                        setIsOpen(false)
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
            </KeyboardAvoidingView>
          </Pressable>
        </Animated.View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black background with opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white', // Modal content background
    borderRadius: 10,
    padding: 20,
  },
  modalText: {
    fontSize: 24,
    marginBottom: 20,
  },
  modalBody: {
    alignItems: 'center',
  },
})

export default MyModal
