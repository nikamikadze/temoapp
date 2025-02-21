import React, { useState } from 'react'
import {
  FlatList,
  StyleSheet,
  Dimensions,
  View,
  Text,
  ImageBackground,
  Pressable,
  Image,
  RefreshControl,
} from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import dealsService from '../api/deals'
import Header from '../components/Header'
import { useFocusEffect } from '@react-navigation/native'
import { registerForPushNotifications } from '../utils/PushNotifications'
import CustomModal from '../components/modal'
import * as Progress from 'react-native-progress'
import { LinearGradient } from 'expo-linear-gradient'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

export default function HomePage({ navigation, isDisplayed = true }) {
  const [dealList, setDealList] = useState([])
  const [countdownList, setCountdownList] = useState([])
  const [wishList, setWishList] = useState('')
  const [wishListModalOpened, setWishListModalOpened] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = () => {
    setRefreshing(true)
    dealsService
      .getList()
      .then((res) => {
        setDealList(res.deals)
      })
      .finally(() => {
        setRefreshing(false)
      })
  }

  const handleScrollBegin = () => {
    setIsScrolling(true)
  }

  const handleScrollEnd = () => {
    setIsScrolling(false)
  }

  useFocusEffect(
    React.useCallback(() => {
      let intervalId

      if (isDisplayed) {
        registerForPushNotifications()

        dealsService
          .getList()
          .then((res) => {
            setDealList(res.deals)
            console.log(111990000)

            initializeCountdown(res.deals, (id) => {
              intervalId = id
            })
          })
          .finally((res) => console.log(12))
      }

      return () => {
        if (intervalId) clearInterval(intervalId)
      }
    }, [isDisplayed])
  )

  const initializeCountdown = (deals, setIntervalId) => {
    const initialCountdowns = deals.map((deal) => {
      let isExpired = false

      const timeDiff = deal.expiracyDate - Date.now()
      if (deal.dealActivatedAt) isExpired = true
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

    // Decrement the countdown every second
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

  const formatTime = (time) => (time < 10 ? `0${time}` : time)
  console.log('home')

  const renderItem = ({ item }) => {
    const countdown = countdownList.find((c) => c.id === item._id)
    return (
      <>
        <View
          style={styles.item}
          onTouchEnd={() => {
            if (!isScrolling)
              navigation.navigate('Details', {
                deal: item,
              })
          }}
        >
          <Image
            style={{
              width: screenWidth * 0.9,
              height: screenWidth - 60,
              borderRadius: 20,
            }}
            source={{
              uri: item.posterImage,
            }}
          />
          {countdown && (
            <View style={styles.countdownBackground}>
              <Text style={styles.countdownText}>
                {countdown.isExpired ? (
                  <Text>ამოიწურა</Text>
                ) : (
                  <>
                    {countdown.days > 0 && `${countdown.days}:`}
                    {formatTime(countdown.hours)}:
                    {formatTime(countdown.minutes)}:
                    {formatTime(countdown.seconds)}
                  </>
                )}
              </Text>
            </View>
          )}
          <View style={styles.progressContainer}>
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
          </View>
        </View>
        <View style={styles.border}></View>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <LinearGradient
        colors={['#0C969C', '#0C969C', '#032F30']}
        style={styles.background}
      />
      <FlatList
        data={dealList}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={1}
        contentContainerStyle={styles.flatList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScrollBeginDrag={handleScrollBegin}
        onScrollEndDrag={handleScrollEnd}
        scrollEventThrottle={16}
        ListFooterComponent={
          <>
            {dealList.length > 0 && (
              <>
                <Text
                  style={{
                    fontFamily: 'MtavruliBold',
                    textTransform: 'uppercase',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: 28,
                    margin: 10,
                    paddingBottom: 10,
                  }}
                >
                  მეტი დაემატება მალე!
                </Text>
                <View
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    marginBottom: 50,
                  }}
                >
                  <Button
                    mode='contained-tonal'
                    buttonColor='white'
                    textColor='black'
                    style={{
                      marginTop: 15,
                      height: 45,
                      width: '70%',
                    }}
                    labelStyle={{
                      fontSize: 18,
                      lineHeight: 45,
                      height: '100%',
                      fontFamily: 'MtavruliBold',
                      textTransform: 'uppercase',
                    }}
                    onPress={() => setWishListModalOpened(true)}
                  >
                    რისი ნახვა გსურს?
                  </Button>
                </View>
              </>
            )}
          </>
        }
      />
      <CustomModal
        isVisible={wishListModalOpened}
        setIsVisible={setWishListModalOpened}
        body={
          <>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <TextInput
                label='რისი ნახვა გსურს?'
                mode='outlined'
                style={{ width: '70%', marginVertical: 20 }}
                onChangeText={(text) => setWishList(text)}
              />
              <Pressable
                style={styles.wishListButton}
                onPress={() => {
                  if (!wishList) return

                  dealsService.sendWish(wishList).then((res) => {
                    setWishListModalOpened(false)
                  })
                }}
              >
                <Text style={styles.closeButtonText}>გაგზავნა</Text>
              </Pressable>
            </View>

            {/* <Pressable
              style={styles.closeButton}
              onPress={() => setWishListModalOpened(false)}
            >
              <Text style={styles.closeButtonText}>ჩახურვა</Text>
            </Pressable> */}
          </>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  border: {
    backgroundColor: '#FFFFFF',
    opacity: 0.2,
    height: 5,
    borderRadius: 12,
    width: screenWidth / 2,
    marginVertical: 20,
    marginHorizontal: 'auto',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 70,
    height: screenHeight - 70,
  },
  flatList: {
    flexGrow: 1,
  },

  item: {
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    height: screenWidth,
    position: 'relative',
  },

  countdownBackground: {
    position: 'absolute',
    top: 5,
    backgroundColor: 'red',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 12,
  },
  countdownText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '80%',
    position: 'relative',
  },
  progressBar: {
    borderRadius: 15, // Half of the height for rounded corners
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    lineHeight: 40, // Matches the height of the progress bar for vertical centering
    color: 'black',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  wishListButton: {
    backgroundColor: '#46d426',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 5,
  },
})
