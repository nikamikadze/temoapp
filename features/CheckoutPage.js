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
  Pressable,
  Alert,
} from 'react-native'
import NumberInputComponent from '../components/numberInput'
import { Button, Checkbox, RadioButton } from 'react-native-paper'
import * as Progress from 'react-native-progress'

import Visa from '../assets/visa.svg'
import MasterCard from '../assets/mastercard.svg'
import useAuthStore from '../zustand/auth'
import dealsService from '../api/deals'
import Header from '../components/Header'
import CustomModal from '../components/modal'
import { LinearGradient } from 'expo-linear-gradient'
import Price from '../components/price'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

function ChcekoutPage({ route, navigation }) {
  const { item } = route.params
  const [count, setCount] = useState(1)
  const [saveCard, setSaveCard] = useState(false)
  const [agreeToRules, setAgreeToRules] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('visaOrMaster')
  const { showSignInModal, isSignedIn } = useAuthStore()
  const [warningModalOpened, setWarningModalOpened] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  function checkoutHandler() {
    setCheckoutLoading(true)

    dealsService
      .buyDeal(item._id, count)
      .then((res) => {
        console.log('deal bought: ', res)
        navigation.navigate('DealList')
        Alert.alert(
          'გილოცავ! ჯგუფში ხარ!!',
          'დაელოდე შეტყობინებას როცა ჯგუფი ბოლომდე შეივსება'
        )
      })
      .catch((err) => {
        alert(err.response.data.message)
        setWarningModalOpened(false)
      })
      .finally(() => setCheckoutLoading(false))
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={[styles.container]}>
          <Header navigation={navigation} />
          <LinearGradient
            colors={['#0C969C', '#0C969C', '#032F30']}
            style={styles.background}
          />
          <View style={styles.description}>
            <Image
              source={{
                uri: item.posterImage,
              }}
              style={styles.image}
            />
            <View style={{ width: '55%', gap: 15 }}>
              <Text style={styles.descrText}>{item.title}</Text>
              <Price oldPrice={item.oldPrice} price={item.price} />
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <Progress.Bar
              progress={Math.min(
                1,
                Math.max(0, item.progressCount / item.totalCount)
              )}
              width={null}
              borderWidth={0}
              height={40}
              color='#52ff80'
              unfilledColor='#ededed'
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {item.progressCount}/{item.totalCount}
            </Text>
          </View>

          <NumberInputComponent value={count} setValue={setCount} />
          <Text style={styles.totalPrice}>
            სულ: {(count * item.price).toFixed(2)}₾
          </Text>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 5,
              alignItems: 'center',
              marginLeft: 15,
              marginVertical: 20,
            }}
          >
            <Visa height={40} width={40} />
            <Text>|</Text>
            <MasterCard height={40} width={40} />
          </View>
          <Button
            buttonColor='#6BA3BE'
            mode='contained'
            style={{
              width: '70%',
              height: 50,
              justifyContent: 'center',
              shadowColor: '#274D60',
              shadowOffset: {
                width: 2,
                height: 5,
              },
              shadowOpacity: 1,
            }}
            onPress={() => {
              if (isSignedIn) setWarningModalOpened(true)
              else showSignInModal(true)
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
                  color='#6BA3BE'
                  onPress={() => setSaveCard(!saveCard)}
                />
              </View>
              <Text style={{ fontSize: 16, color: 'white' }}>
                ბარათის დამახსოვრება
              </Text>
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
                  color='#6BA3BE'
                />
              </View>
              <Text style={{ fontSize: 16, color: 'white' }}>
                ვეთანხმები წესებს
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <CustomModal
        isVisible={warningModalOpened}
        setIsVisible={setWarningModalOpened}
        body={
          <>
            <Text
              style={{
                fontFamily: 'MtavruliBold',
                textTransform: 'uppercase',
                width: '60%',
                textAlign: 'center',
                fontSize: 20,
              }}
            >
              რა უნდა იცოდე:
            </Text>
            <Text style={{ width: '95%', marginVertical: 15, fontSize: 18 }}>
              თუ ჯგუფი ბოლომდე შეივსო დროის ამოწურვამდე, მიიღებ ვოუჩერს რომლითაც
              მიმართავ პირდაირ მომწოდებელს.
            </Text>

            <Text style={{ width: '95%', fontSize: 18 }}>
              თუ ჯგუფი არ შედგა, სრული თანხა დაგიბრუნდება ბარათზე მომენტალურად.
            </Text>

            <Pressable
              style={[
                styles.closeButton,
                { opacity: checkoutLoading ? 0.3 : 1 },
              ]}
              onPress={() => {
                if (!checkoutLoading) checkoutHandler()
              }}
            >
              <Text style={styles.closeButtonText}>დასტური</Text>
            </Pressable>
          </>
        }
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 70,
    height: screenHeight - 70,
  },
  description: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  descrText: {
    color: '#fff',
    width: '95%',
    fontSize: 22,
    textTransform: 'uppercase',
    fontFamily: 'MtavruliBold',
    lineHeight: 24,
  },
  checkboxWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uncheckedBorder: {
    borderWidth: 2,
    opacity: 0.6,
    borderColor: 'white',
    borderRadius: 20,
    transform: [{ scale: 0.7 }],
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    width: '80%',
    padding: 10,
    marginVertical: 20,
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
    color: 'white',
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
  closeButton: {
    backgroundColor: '#46d426',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'MtavruliBold',
    textTransform: 'uppercase',
  },
})

export default ChcekoutPage
