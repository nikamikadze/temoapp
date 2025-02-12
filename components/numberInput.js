import React, { useState } from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'

const screenWidth = Dimensions.get('window').width

const NumberInputComponent = ({ value, setValue }) => {
  const increment = () => {
    setValue((prev) => prev + 1)
  }

  const decrement = () => {
    setValue((prev) => (prev > 1 ? prev - 1 : 1))
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={decrement} style={styles.button}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        keyboardType='numeric'
        value={value.toString()}
        onChangeText={(text) => setValue(Number(text))}
      />

      <TouchableOpacity onPress={increment} style={styles.button}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth * 0.8,
    height: 50,
    marginVertical: 20,
  },
  input: {
    width: '60%',
    height: '100%',
    textAlign: 'center',
    fontSize: 24,
    backgroundColor: '#fff',
    borderRadius: 25,
  },
  button: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6BA3BE',
    borderRadius: 25,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
  },
})

export default NumberInputComponent
