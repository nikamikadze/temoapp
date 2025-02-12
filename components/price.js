import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Price = ({ oldPrice, price }) => {
  return (
    <View
      style={{
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 26,
          fontFamily: 'MtavruliBold',
          textTransform: 'uppercase',
          paddingTop: 30,
        }}
      >
        ფასი:{' '}
      </Text>

      <View style={styles.priceContainer}>
        <Text style={styles.oldPrice}>{oldPrice.toFixed(2)}₾</Text>
        <Text style={styles.price}>{price.toFixed(2)}₾</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  priceContainer: {
    position: 'relative',
    paddingTop: 30,
    width: 100,
  },
  oldPrice: {
    left: 2,
    top: 15,
    position: 'absolute',
    textDecorationLine: 'line-through',
    color: 'white',
    fontSize: 14,
    textTransform: 'uppercase',
  },

  price: {
    textAlign: 'center',
    color: 'white',
    fontSize: 26,
    fontFamily: 'MtavruliBold',
    textTransform: 'uppercase',
  },
})

export default Price
