import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import NumberInputComponent from '../components/numberInput'
import { Button, Checkbox, ProgressBar, RadioButton } from 'react-native-paper'
import Visa from '../assets/visa.svg'
import MasterCard from '../assets/mastercard.svg'
import useAuthStore from '../zustand/auth'
import dealsService from '../api/deals'
import AuthModal from '../components/authModal'
import Header from '../components/Header'

const screenWidth = Dimensions.get('window').width

function ChcekoutPage({ route, navigation }) {
  const { item } = route.params
  const [count, setCount] = useState(1)
  const [saveCard, setSaveCard] = useState(false)
  const [agreeToRules, setAgreeToRules] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('visaOrMaster')

  const [modalVisible, setModalVisible] = useState(false)
  const [dealCount, setDealCount] = useState(0)

  const { isSignedIn } = useAuthStore()

  useEffect(() => {
    dealsService
      .userDealCount(item._id)
      .then((res) => {
        console.log(res)
        setDealCount(res.count)
      })
      .catch((err) => console.log(err))
  }, [])

  function checkoutHandler() {
    dealsService
      .buyDeal(item._id, count)
      .then((res) => {
        console.log('deal bought: ', res)
        navigation.navigate('DealList')
        alert('გილოცავთ თქვენ შეიძინეთ შეთავაზება!')
      })
      .catch((err) => alert(err.response.data.message))
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container]}>
        <Header navigation={navigation} />
        <View style={styles.description}>
          <Image
            source={{ uri: `http://192.168.0.3:5000${item.imageUrl}` }}
            style={styles.image}
          />
          <View style={{ width: '55%', gap: 15 }}>
            <Text style={styles.descrText}>{item.title}</Text>
            <Text style={styles.descrText}>{item.description}</Text>
            <Text style={styles.price}>{item.price.toFixed(2)}₾</Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <ProgressBar
            progress={item.progressCount / item.totalCount}
            color='#652d90'
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {item.progressCount}/{item.totalCount}
          </Text>
        </View>
        {dealCount > 0 && (
          <Text style={{ fontSize: 18, color: 'red' }}>
            შენ უკვე იყიდე ეს შეთავაზება {dealCount}-ჯერ
          </Text>
        )}
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
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              gap: 5,
              alignItems: 'center',
              marginLeft: 15,
            }}
          >
            <Visa height={40} width={40} />
            <Text>|</Text>
            <MasterCard height={40} width={40} />
          </View>
        </TouchableOpacity>
        <Button
          mode='contained'
          style={{ width: '70%', height: 50, justifyContent: 'center' }}
          onPress={() => {
            if (isSignedIn) checkoutHandler()
            else setModalVisible(true)
          }}
        >
          <Text
            style={{
              fontSize: 24,
              lineHeight: 30,
              fontFamily: 'MtavruliBold',
              textTransform: 'uppercase',
            }}
          >
            ყიდვა!
          </Text>
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
        <AuthModal isVisible={modalVisible} setIsVisible={setModalVisible} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27aae2',
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
    fontFamily: 'MtavruliBold',
    textTransform: 'uppercase',
  },

  image: {
    margin: 10,
    borderRadius: 20,
    width: screenWidth / 2.5,
    height: screenWidth / 2.5,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
})

export default ChcekoutPage
