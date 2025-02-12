import React, { useEffect, useState } from 'react'
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Button } from 'react-native-paper'
import dealsService from '../api/deals'
import Header from '../components/Header'
import QRCode from 'react-native-qrcode-svg'
import * as Progress from 'react-native-progress'
import { LinearGradient } from 'expo-linear-gradient'
import CustomModal from '../components/modal'
import { useFocusEffect } from '@react-navigation/native'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

export default function DealHistory({ route, navigation }) {
  const { category } = route.params
  const [userDeals, setUserDeals] = useState([])
  const [quitDealModal, setQuitDealModal] = useState({})
  const [countdownList, setCountdownList] = useState([])
  const [dealsLoaded, setDealsLoaded] = useState(false)
  const initializeCountdown = (deals, setIntervalId) => {
    const initialCountdowns = deals.map((deal) => {
      let isExpired = false

      const timeDiff = deal.expiracyDate - Date.now()

      if (timeDiff < 0) isExpired = true

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor(
        (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      )
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

      return {
        id: deal._id,
        days,
        hours,
        minutes,
        seconds,
        isExpired,
      }
    })

    setCountdownList(initialCountdowns)

    const intervalId = setInterval(() => {
      setCountdownList((prevCountdowns) =>
        prevCountdowns.map((countdown) => {
          let { days, hours, minutes, seconds } = countdown

          if (seconds > 0) {
            seconds--
          } else if (minutes > 0) {
            minutes--
            seconds = 59
          } else if (hours > 0) {
            hours--
            minutes = 59
            seconds = 59
          } else if (days > 0) {
            days--
            hours = 23
            minutes = 59
            seconds = 59
          } else {
            // Countdown finished
            return {
              ...countdown,
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
            }
          }

          return {
            ...countdown,
            days,
            hours,
            minutes,
            seconds,
          }
        })
      )
    }, 1000)

    setIntervalId(intervalId)
  }

  useFocusEffect(
    React.useCallback(() => {
      let intervalId
      dealsService.userDeals(category).then((res) => {
        setDealsLoaded(true)
        setUserDeals(res)
        if (category === 'active') {
          initializeCountdown(res, (id) => {
            intervalId = id
          })
        }
      })

      return () => {
        if (intervalId) clearInterval(intervalId)
      }
    }, [])
  )

  const onShare = async () => {
    try {
      await Share.share({
        message: 'Join me in this deal! Time is ticking!',
        url: 'https://www.facebook.com/jgupuri',
      })
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  const formatTime = (time) => (time < 10 ? `0${time}` : time)

  const renderItem = ({ item }) => {
    const countdown = countdownList.find((c) => c.id === item._id)

    return (
      <View
        style={{
          marginBottom: 30,
          alignItems: 'center',
        }}
      >
        <View style={styles.description}>
          <Image
            source={{ uri: `http://192.168.1.111:5000${item.posterImage}` }}
            style={styles.image}
          />
          <View style={{ width: '55%', gap: 15 }}>
            <Text style={styles.descrText}>{item.title}</Text>
            <Text style={styles.price}>{item.price.toFixed(2)}₾</Text>
            <Text style={styles.descrText}>ნაყიდია: {item.count}</Text>
            {category === 'active' && (
              <Text style={{ color: 'red' }}>
                დარჩენილია:
                <>
                  {countdown.days > 0 && `${countdown.days}:`}
                  {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:
                  {formatTime(countdown.seconds)}
                </>
              </Text>
            )}

            {category === 'canceled' && (
              <Text style={{ color: 'red' }}>დრო ამოიწურა!</Text>
            )}
          </View>
        </View>
        {category === 'completed' && (
          <>
            {item.voucherActivatedAt ? (
              <>
                {item.voucherStatus === 'used' ? (
                  <View
                    style={{
                      backgroundColor: 'black',
                      padding: 20,
                      borderRadius: 20,
                    }}
                  >
                    <Text>ვაუჩერი გამოყენებულია</Text>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center', gap: 20 }}>
                    <QRCode
                      value={`http://192.168.1.111:5500?imageUrl=${encodeURIComponent(
                        item.posterImage
                      )}&count=${encodeURIComponent(
                        item.count
                      )}&voucherId=${encodeURIComponent(item.voucher)}`}
                      size={150}
                    />
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 18,
                        textTransform: 'uppercase',
                      }}
                    >
                      ვაუჩერი: {item.voucher}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  padding: 20,
                  borderRadius: 20,
                }}
                onPress={() =>
                  Alert.alert(
                    'გააქტიურე ვაუჩერი',
                    'ვაუჩერის კოდი ერთჯერადია! დასკანერებადია მხოლოდ ერთხელ.',
                    [
                      {
                        text: 'გააქტიურება',
                        onPress: () =>
                          dealsService
                            .activateVoucher(item.voucher)
                            .then((res) => {
                              dealsService.userDeals(category).then((res) => {
                                setUserDeals(res)
                              })
                              alert(
                                'ვაუჩერი გააქტიურდა! დაასკანერეთ მაღაზიაში და მიიღეთ თქვენი პროდუქტი'
                              )
                            }),
                      },
                      { text: 'გათიშვა', style: 'cancel' },
                    ]
                  )
                }
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 18,
                    textTransform: 'uppercase',
                  }}
                >
                  გააქტიურე ვაუჩერი
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
        {category === 'active' && (
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
        )}

        {category === 'active' && (
          <>
            <TouchableOpacity
              onPress={() => {
                setQuitDealModal(item)
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  margin: 15,
                  color: 'white',
                  fontSize: 16,
                  textDecorationLine: 'underline',
                  textTransform: 'uppercase',
                }}
              >
                აღარ მინდა
              </Text>
            </TouchableOpacity>
            {item.expiracyDate - Date.now() > 3600000 && (
              <Button
                buttonColor='#6BA3BE'
                style={{ width: '50%', margin: 10 }}
                mode='contained'
                onPress={() => {
                  onShare()
                }}
              >
                გაუზიარე მეგობრებს
              </Button>
            )}
          </>
        )}
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} hasRightIcon={false} />

      <LinearGradient
        colors={['#0C969C', '#0C969C', '#032F30']}
        style={styles.background}
      />
      {userDeals.length > 0 ? (
        <FlatList
          data={userDeals}
          renderItem={renderItem}
          keyExtractor={(item) => item.dealId}
          numColumns={1}
          contentContainerStyle={styles.flatList}
        />
      ) : (
        <>
          {dealsLoaded && (
            <Text
              style={{
                color: 'white',
                opacity: 0.5,
                fontSize: 28,
                fontFamily: 'Mtavruli',
                textAlign: 'center',
                marginTop: 30,
              }}
            >
              {category === 'completed' && 'წარმატებული '}
              {category === 'active' && 'მიმდინარე '}
              {category === 'canceled' && 'წარუმატებელი '}
              შეთავაზებები ცარიელია
            </Text>
          )}
        </>
      )}

      <CustomModal
        setIsVisible={setQuitDealModal}
        isVisible={Object.keys(quitDealModal).length > 0}
        body={
          <>
            <Text
              style={{
                fontFamily: 'MtavruliBold',
                textTransform: 'uppercase',
                fontSize: 24,
                marginTop: 20,
              }}
            >
              ნაღდად?
            </Text>
            <Image
              source={{
                uri: `http://192.168.1.111:5000${quitDealModal.posterImage}`,
              }}
              style={{ width: 80, height: 80, margin: 30, borderRadius: 14 }}
            />
            <View
              style={{
                flexDirection: 'row',
                gap: 20,
                width: '80%',
              }}
            >
              <Button
                buttonColor='red'
                style={{ width: '50%', marginVertical: 'auto' }}
                mode='contained'
                onPress={() => {
                  dealsService
                    .quitDeal(quitDealModal.dealId)
                    .then((res) => {
                      alert('თქვენ გამოხვედით ჯგუფიდან')
                      setUserDeals((prev) =>
                        prev.filter((deal) => deal.id !== quitDealModal.id)
                      )
                      setQuitDealModal(false)
                    })
                    .catch((err) => console.log(err.response.message))
                }}
              >
                გავალ
              </Button>
              <Button
                buttonColor='#00bf20'
                style={{ width: '50%', marginVertical: 'auto' }}
                mode='contained'
                onPress={() => {
                  setQuitDealModal(false)
                }}
              >
                დავრჩები
              </Button>
            </View>
          </>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    flexDirection: 'row',
    position: 'relative',
    width: screenWidth,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#27aae2',
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
    margin: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  descrText: {
    width: '95%',
    fontSize: 22,
    textTransform: 'uppercase',
    fontFamily: 'MtavruliBold',
    color: 'white',
    lineHeight: 24,
  },

  price: {
    fontSize: 22,
    textTransform: 'uppercase',
    fontFamily: 'MtavruliBold',
    lineHeight: 24,
    color: 'white',
  },
  progressBarContainer: {
    width: '90%',
    marginVertical: 10,
    position: 'relative',
    marginHorizontal: 'auto',
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

  image: {
    margin: 10,
    borderRadius: 20,
    width: screenWidth / 2.5,
    height: screenWidth / 2.5,
  },
})
