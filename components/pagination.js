import React from 'react'
import { View, StyleSheet, Animated, Dimensions } from 'react-native'

const screenWidth = Dimensions.get('window').width

const Pagination = ({ index, count }) => {
  const animatedValue = new Animated.Value(index)

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: index,
      useNativeDriver: false,
    }).start()
  }, [index])

  return (
    <View style={styles.paginationContainer}>
      {Array.from({ length: count }).map((_, i) => {
        const scale = animatedValue.interpolate({
          inputRange: [i - 1, i, i + 1],
          outputRange: [0.8, 1.2, 0.8],
          extrapolate: 'clamp',
        })
        const opacity = animatedValue.interpolate({
          inputRange: [i - 1, i, i + 1],
          outputRange: [0.5, 1, 0.5],
          extrapolate: 'clamp',
        })

        return (
          <Animated.View
            key={i}
            style={[
              styles.circle,
              {
                transform: [{ scale }],
                opacity,
                backgroundColor: i === index ? 'black' : 'gray',
              },
            ]}
          />
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'absolute',
    bottom: 100,
    left: screenWidth / 2 - 40,
  },

  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 1,
    marginHorizontal: 5,
  },
})

export default Pagination
