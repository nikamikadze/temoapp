import React, { useState, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import authService from '../api/auth'

const VerifyEmail = ({ email, password, setIsVisible, setToken }) => {
  const [code, setCode] = useState(Array(6).fill(''))
  const inputsRef = useRef([])

  const handleInputChange = (index, value) => {
    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    if (value && index < code.length - 1) {
      inputsRef.current[index + 1].focus()
    }
  }

  const singInHandler = () => {
    authService
      .signIn(email, password)
      .then(async (res) => {
        console.log(res)

        if (res.success) {
          await setToken(res.user.accessToken)
          setIsVisible(false)
          alert('წარმატებით შეხვედით')
        }
      })
      .catch((err) => {
        console.log(err.response)

        if (err.response.status === 403) {
          console.log('user is undefined')
        } else {
          alert(err.response.data.message)
        }
      })
  }

  const verifyHandler = () => { 
    const fullCode = code.join('')
    console.log(email, fullCode)

    authService
      .verifyEmail(email, fullCode)
      .then((res) => {
        console.log('verified', email, password)

        setTimeout(() => {
          singInHandler()
        }, 2000)
      })
      .catch((err) => {
        console.log(err.response.status, err.response.data.message)
      })
  }

  return (
    <>
      <Text style={styles.modalText}>Verify Email</Text>
      <View style={styles.modalBody}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              mode='outlined'
              keyboardType='numeric'
              style={{ width: '15%' }}
              maxLength={1}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChangeText={(value) => handleInputChange(index, value)}
            />  
          ))}
        </View>
        <Button
          mode='contained'
          onPress={verifyHandler}
          style={{ marginTop: 25 }}
        >
          Verify
        </Button>
        <Button
          onPress={() => {
            authService.sendVerifyCode(email)
          }}
        >
          Didn't receive code? Resend it
        </Button>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
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

export default VerifyEmail
