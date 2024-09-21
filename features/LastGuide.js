import React, { useRef, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native'
import HomePage from './HomePage'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const LastGuide = ({ onSwipeUp }) => {
  const translateY = useRef(new Animated.Value(0)).current
  const homeTranslateY = useRef(new Animated.Value(screenHeight)).current // Home starts off-screen
  const [swiped, setSwiped] = useState(false)

  // Bounce animation function
  const bounceAnimation = () => {
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: -screenHeight * 0.3,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -screenHeight * 0.15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()

    Animated.sequence([
      Animated.timing(homeTranslateY, {
        toValue: screenHeight - screenHeight * 0.3,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(homeTranslateY, {
        toValue: screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(homeTranslateY, {
        toValue: screenHeight - screenHeight * 0.15,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(homeTranslateY, {
        toValue: screenHeight,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start()
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      bounceAnimation()
    }, 3000)

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [])

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
    onPanResponderMove: (evt, gestureState) => {
      if (!swiped && gestureState.dy < 0) {
        // Move the guide view up with the gesture
        Animated.timing(translateY, {
          toValue: gestureState.dy, // Move the view with the gesture
          duration: 0,
          useNativeDriver: true,
        }).start()

        // Simultaneously move the HomeScreen into view
        Animated.timing(homeTranslateY, {
          toValue: screenHeight + gestureState.dy, // Adjust home position based on swipe
          duration: 0,
          useNativeDriver: true,
        }).start()
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy < -50 && !swiped) {
        setSwiped(true)
        // Complete the swipe and navigate to home
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -screenHeight, // Move the LastGuide up out of view
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(homeTranslateY, {
            toValue: 0, // Bring HomeScreen fully into view
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onSwipeUp() // Call the function to officially navigate to home
        })
      } else {
        // If not enough swipe, reset the views
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start()

        Animated.timing(homeTranslateY, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }).start()
      }
    },
  })

  return (
    <View style={styles.mainContainer}>
      <Animated.View
        style={[
          styles.homeContainer,
          { transform: [{ translateY: homeTranslateY }] },
        ]}
      >
        <HomePage />
      </Animated.View>

      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.container, { transform: [{ translateY }] }]}
      >
        <Text style={styles.text}>Swipe Up to go to Home Page</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  container: {
    backgroundColor: 'rgb(170,226,255)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
  },
  text: {
    fontSize: 24,
    color: 'white',
  },
  homeContainer: {
    flex: 1,
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
  },
})

export default LastGuide
