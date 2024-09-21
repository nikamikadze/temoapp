import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native'
import NumberInputComponent from '../components/numberInput'
import { Button, Checkbox, ProgressBar, RadioButton } from 'react-native-paper'

function ChcekoutPage({ route, navigation }) {
  const { item } = route.params
  const [count, setCount] = useState(1)
  const [saveCard, setSaveCard] = useState(false)
  const [agreeToRules, setAgreeToRules] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('visaOrMaster')
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container]}>
        <View style={styles.description}>
          <Image
            source={{
              uri: item.uri,
            }}
            style={styles.image}
          />
          <View style={{ width: '60%', gap: 15 }}>
            <Text style={styles.descrText}>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatibus, aperiam odit, voluptate neque asperiores, quae
            </Text>
            <Text style={styles.price}>{item.price.toFixed(2)}₾</Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <ProgressBar
            progress={item.progress / item.total}
            color='#652d90'
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {item.progress}/{item.total}
          </Text>
        </View>
        <NumberInputComponent value={count} setValue={setCount} />
        <Text style={styles.totalPrice}>
          ჯამური ფასი: {(count * item.price).toFixed(2)}₾
        </Text>

        <TouchableOpacity
          style={styles.paymentMethod}
          onPress={() => {
            setPaymentMethod('visaOrMaster')
          }}
        >
          <View
            style={{
              borderRadius: 25,
              backgroundColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <RadioButton
              value='visaOrMaster'
              status={
                paymentMethod === 'visaOrMaster' ? 'checked' : 'unchecked'
              }
            />
          </View>
          <Text>Visa | Master</Text>
        </TouchableOpacity>
        <Button
          mode='contained'
          style={{ width: '70%', height: 50, justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 24, lineHeight: 30 }}>BUY IT NOW!</Text>
        </Button>
        <View style={{ alignItems: 'flex-start', gap: 10, marginTop: 30 }}>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            onPress={() => {
              setSaveCard((prev) => !prev)
            }}
          >
            <View style={[styles.checkboxWrapper, styles.uncheckedBorder]}>
              <Checkbox
                status={saveCard ? 'checked' : 'unchecked'}
                uncheckedColor='lightgray'
                color='#6200ee'
              />
            </View>
            <Text style={{ fontSize: 18 }}>ბარათის დამახსოვრება</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            onPress={() => {
              setAgreeToRules((prev) => !prev)
            }}
          >
            <View style={[styles.checkboxWrapper, styles.uncheckedBorder]}>
              <Checkbox
                status={agreeToRules ? 'checked' : 'unchecked'}
                uncheckedColor='lightgray'
                color='#6200ee'
              />
            </View>
            <Text style={{ fontSize: 18 }}>ვეთანხმები წესებს</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(170,226,255)',
    alignItems: 'center',
  },
  description: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  descrText: {
    width: '95%',
    fontSize: 16,
    lineHeight: 24,
  },
  checkboxWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedBorder: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    width: '80%',
    padding: 10,
    marginVertical: 20,
  },

  price: {
    fontSize: 24,
    lineHeight: 24,
    color: 'white',
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
  },
  progressBarContainer: {
    width: '90%',
    position: 'relative',
    marginBottom: 30,
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
  totalPrice: {
    marginTop: 10,
    textAlign: 'left',
    fontSize: 24,
    lineHeight: 24,
    color: 'black',
    textShadowColor: 'rgba(255, 255, 255, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },

  image: {
    width: '40%',
    height: '100%',
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
})

export default ChcekoutPage
