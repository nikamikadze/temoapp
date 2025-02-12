import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native'

const CustomModal = ({
  isVisible,
  setIsVisible,
  body,
  backgroundVisible = true,
}) => {
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (isVisible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start()
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <Animated.View
      style={[styles.overlay, { opacity }]}
      onTouchEnd={() => setIsVisible(false)}
    >
      <View
        style={[
          styles.modal,
          {
            backgroundColor: backgroundVisible ? '#fff' : 'transparent',
            padding: backgroundVisible ? 20 : 0,
          },
        ]}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <TouchableOpacity
          style={{ position: 'absolute', top: 10, right: 15 }}
          onPress={() => setIsVisible(false)}
        >
          <Text style={{ fontSize: 20 }}>X</Text>
        </TouchableOpacity>

        {body}
      </View>
    </Animated.View>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  overlay: {
    zIndex: 11,
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  },
  modal: {
    position: 'relative',
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})

export default CustomModal
