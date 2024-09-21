import React, { useState, useEffect, useRef } from 'react'
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native'
import { ProgressBar, TextInput, Button } from 'react-native-paper'

const screenWidth = Dimensions.get('window').width

export default function ProductDetails({ route, navigation }) {
  const { item } = route.params
  const [data, setData] = useState(item)
  const [modalVisible, setModalVisible] = useState(false)
  const [signUpPageIsOn, setSignUpPageIsOn] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const backgroundColorOpacity = useRef(new Animated.Value(0)).current

  const incrementProgress = () => {
    setData((prevData) => ({
      ...prevData,
      progress: Math.min(prevData.progress + 1, prevData.total),
    }))
  }

  useEffect(() => {
    if (modalVisible) {
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
  }, [modalVisible])

  const animatedBackgroundColor = backgroundColorOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)'],
  })

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>ჯგუფური</Text>
      </View>
      <View style={styles.item}>
        <View style={styles.imgContainer}>
          <Image source={{ uri: data.uri }} style={styles.image} />
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={data.progress / data.total}
              color='#652d90'
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {data.progress}/{data.total}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (isSignedIn) {
                  navigation.navigate('Checkout', {
                    item: item,
                  })
                } else setModalVisible(true)
              }}
            >
              <Text style={styles.buttonText}>მეც მინდა!</Text>
            </TouchableOpacity>

            {data.progress === data.total && (
              <Button
                title='Done Deal'
                onPress={() => alert('DONE!')}
                color='black'
                style={styles.addButton}
              />
            )}
          </View>
        </View>
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false)
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
            onPress={() => setModalVisible(false)}
          >
            <KeyboardAvoidingView
              style={styles.modalContainer}
              onStartShouldSetResponder={() => true}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={0}
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
                        setModalVisible(false)
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
                        setModalVisible(false)
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(170,226,255)',
  },
  header: {
    height: 70,
    width: screenWidth,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    width: '70%',
    position: 'relative',
    height: '70%',
  },
  button: {
    width: screenWidth - 100,
    marginTop: 20,
    backgroundColor: '#ed008c',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 24,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    width: screenWidth,
    height: screenWidth,
    padding: 10,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBarContainer: {
    width: '90%',
    position: 'relative',
  },
  progressBar: {
    height: 30,
    borderRadius: 15,
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    lineHeight: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackgroundPressable: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalBody: {
    height: '95%',
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
