import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import authService from '../api/auth'

const ResetPassword = ({ email, successHandler }) => {
  const [code, setCode] = useState(Array(6).fill(''))
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const inputsRef = useRef([])
  const [resendTimer, setResendTimer] = useState(0)

  useEffect(() => {
    let timer
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [resendTimer])

  const handleInputChange = (index, value) => {
    if (value.length === 6) {
      const newCode = value.split('')
      setCode(newCode)
      setTimeout(() => inputsRef.current[5]?.focus(), 50)
    } else {
      if (value.length > 1) return
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus()
      }
    }
  }

  const resetPasswordHandler = () => {
    const fullCode = code.join('')
    if (!newPassword || newPassword !== confirmPassword) {
      alert('გთხოვთ სწორად შეიყვანოთ პაროლები')
      return
    }

    authService
      .resetPassword(email, fullCode, newPassword)
      .then(() => {
        alert('პაროლი წარმატებით შეიცვალა')
        successHandler()
      })
      .catch((err) => {
        console.log(err.response?.status, err.response?.data?.message)
        alert(err.response?.data?.message || 'დაფიქსირდა შეცდომა')
      })
  }

  const handleResend = () => {
    authService
      .sendVerifyCode(email)
      .then(() => {
        setResendTimer(60)
      })
      .catch((err) => {
        console.log(err.response)
      })
  }

  return (
    <>
      <Text style={styles.modalText}>პაროლის აღდგენა</Text>
      <View style={styles.modalBody}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              mode='outlined'
              keyboardType='numeric'
              style={{ width: '15%' }}
              value={digit}
              ref={(el) => (inputsRef.current[index] = el)}
              onChangeText={(value) => handleInputChange(index, value)}
            />
          ))}
        </View>

        <TextInput
          label='ახალი პაროლი'
          mode='outlined'
          style={{ width: '90%' }}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          label='გაიმეორეთ პაროლი'
          mode='outlined'
          style={{ width: '90%' }}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Button
          mode='contained'
          onPress={resetPasswordHandler}
          style={{ marginTop: 25 }}
        >
          შეცვლა
        </Button>

        <Button onPress={handleResend} disabled={resendTimer > 0}>
          {resendTimer > 0
            ? `ხელახლა გაგზავნა ${resendTimer}წმ-ში`
            : 'ვერ მიიღეთ კოდი? ხელახლა გაგზავნა'}
        </Button>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  modalBody: {
    height: '90%',
    width: '90%',
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

export default ResetPassword
