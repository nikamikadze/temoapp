import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
} from 'react-native'
import { Button, ProgressBar } from 'react-native-paper'
import dealsService from '../api/deals'
import Header from '../components/Header'

const initialImageData = [
  {
    id: '1',
    uri: require('../assets/1.png'),
    price: 1200,
    progress: 0,
    total: 50,
  },
  {
    id: '2',
    uri: require('../assets/2.png'),
    price: 1200,
    progress: 0,
    total: 30,
  },
  {
    id: '3',
    uri: require('../assets/3.png'),
    price: 1200,
    progress: 0,
    total: 50,
  },
  {
    id: '4',
    uri: require('../assets/4.png'),
    price: 1200,
    progress: 0,
    total: 30,
  },
  {
    id: '5',
    uri: require('../assets/5.png'),
    price: 1200,
    progress: 0,
    total: 50,
  },
  {
    id: '6',
    uri: require('../assets/6.png'),
    price: 1200,
    progress: 0,
    total: 30,
  },
]

const screenWidth = Dimensions.get('window').width

export default function HomePage({ navigation, isDisplayed }) {
  const [dealList, setDealList] = useState([])
  const [countdownList, setCountdownList] = useState([])

  useEffect(() => {
    if (isDisplayed) {
      dealsService.getList().then((res) => {
        setDealList(res.deals)

        initializeCountdown(res.deals)
      })
    }
  }, [isDisplayed])

  const initializeCountdown = (deals) => {
    const initialCountdowns = deals.map((deal) => {
      const timeDiff = deal.expiracyDate - Date.now()
      console.log(timeDiff)

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

    return () => clearInterval(intervalId)
  }
  const formatTime = (time) => (time < 10 ? `0${time}` : time)

  const renderItem = ({ item }) => {
    const countdown = countdownList.find((c) => c.id === item._id)

    return (
      <>
        <ImageBackground
          source={{ uri: `http://192.168.1.111:5000${item.imageUrl}` }}
          style={styles.item}
        >
          {countdown && (
            <Text style={styles.countdownText}>
              დარჩენილია: {countdown.days > 0 && `${countdown.days}d `}
              {formatTime(countdown.hours)}:{formatTime(countdown.minutes)}:
              {formatTime(countdown.seconds)}
            </Text>
          )}

          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <ProgressBar
                progress={item.progressCount / item.totalCount}
                color='#73fc03'
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {item.progressCount}/{item.totalCount}
              </Text>
            </View>
          </View>
          <Button
            mode='contained'
            style={{
              marginTop: 15,
              height: 45,
              width: screenWidth / 2,
            }}
            labelStyle={{
              fontSize: 20,
              lineHeight: 45,
              height: '100%',
              fontFamily: 'MtavruliBold',
              textTransform: 'uppercase',
            }}
            onPress={() =>
              navigation.navigate('Details', {
                deal: item,
              })
            }
          >
            დეტალები
          </Button>
        </ImageBackground>
        <View style={styles.border}></View>
      </>
    )
  }

  const renderHeader = () => <Header navigation={navigation} />
  return (
    <View style={styles.container}>
      <FlatList
        data={dealList}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={1}
        contentContainerStyle={styles.flatList}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <>
            {dealList.length > 0 && (
              <Text
                style={{
                  fontFamily: 'Mtavruli',
                  color: 'red',
                  textAlign: 'center',
                  fontSize: 20,
                  margin: 10,
                  paddingBottom: 40,
                }}
              >
                მეტი დაემატება მალე
              </Text>
            )}
          </>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#27aae2' },

  imgContainer: {
    width: '70%',
    position: 'relative',
    height: '70%',
  },
  border: {
    backgroundColor: 'black',
    height: 15,
    width: screenWidth,
  },
  flatList: {
    flexGrow: 1,
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 12,
    width: screenWidth,
    height: screenWidth,
    padding: 10,
  },
  countdownText: {
    color: 'red',
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
    shadowColor: 'black',
    shadowOffset: { width: -2, height: -2 },
    shadowRadius: 1,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 5,
    shadowOpacity: 0.7,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBarContainer: {
    width: '90%',
    position: 'relative',
  },
  progressBar: {
    height: 40,
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
})
