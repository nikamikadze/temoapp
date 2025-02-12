import React, { useEffect, useState } from 'react'
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Share,
  Animated,
  ScrollView,
  FlatList,
} from 'react-native'
import Header from '../components/Header'
import * as Progress from 'react-native-progress'
import { LinearGradient } from 'expo-linear-gradient'
import { ExpandableText } from '../components/ExpandableText'
import CustomModal from '../components/modal'
import Price from '../components/price'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const CountdownTimer = ({ targetTimestamp }) => {
  const [timeLeft, setTimeLeft] = useState(targetTimestamp - Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      const remainingTime = targetTimestamp - Date.now()
      if (remainingTime <= 0) {
        clearInterval(interval)
        setTimeLeft(0)
      } else {
        setTimeLeft(remainingTime)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetTimestamp])

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const days = Math.floor(totalSeconds / 86400)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${days}:${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return (
    <>
      <Text>{timeLeft > 0 ? formatTime(timeLeft) : 'Time’s up!'}</Text>
    </>
  )
}

export default function ProductDetails({ route, navigation }) {
  const [imageIsFullscreen, setImageIsFullscreen] = useState(false)
  const { deal } = route.params

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
  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />
      <LinearGradient
        colors={['#0C969C', '#0C969C', '#032F30']}
        style={styles.background}
      />
      <ScrollView>
        <View style={styles.item}>
          <FlatList
            style={{ minHeight: screenWidth * 0.8 }}
            data={deal.imageUrls}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.imgContainer}>
                <TouchableOpacity onPress={() => setImageIsFullscreen(item)}>
                  <Image
                    source={{
                      uri: `http://192.168.1.111:5000${item}`,
                    }}
                    style={styles.image}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
          <Price oldPrice={deal.oldPrice} price={deal.price} />
          <ExpandableText text={deal.description} maxHeight={100} />
          <Text
            style={{
              width: '90%',
              fontSize: 16,
              color: '#fff',
              fontFamily: 'MtavruliBold',
              textTransform: 'uppercase',
            }}
          >
            დარჩენილია: <CountdownTimer targetTimestamp={deal.expiracyDate} />
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBarContainer}>
              <Progress.Bar
                progress={Math.min(
                  1,
                  Math.max(0, deal.progressCount / deal.totalCount)
                )}
                width={null}
                borderWidth={0}
                height={40}
                color='#52ff80'
                unfilledColor='#ededed'
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {deal.progressCount}/{deal.totalCount}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('Checkout', {
                    item: deal,
                  })
                }}
              >
                <Text style={styles.buttonText}>მეც მინდა!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onShare()
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    margin: 30,
                    color: 'white',
                    fontSize: 18,
                    textDecorationLine: 'underline',
                    textTransform: 'uppercase',
                  }}
                >
                  გაუზიარე მეგობრებს
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <CustomModal
        backgroundVisible={false}
        isVisible={imageIsFullscreen}
        setIsVisible={setImageIsFullscreen}
        body={
          <View style={{ width: screenWidth, aspectRatio: 1 / 1 }}>
            <Image
              source={{ uri: `http://192.168.1.111:5000${imageIsFullscreen}` }}
              style={styles.image}
            />
          </View>
        }
      ></CustomModal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 70,
    height: screenHeight - 70,
  },
  imgContainer: {
    width: screenWidth * 0.8,
    position: 'relative',
    height: screenWidth * 0.8,
    marginHorizontal: screenWidth * 0.04,
  },

  button: {
    width: screenWidth - 100,
    marginTop: 20,
    backgroundColor: '#6BA3BE',
    shadowColor: '#274D60',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 1,
    borderRadius: 18,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'MtavruliBold',
    textTransform: 'uppercase',
  },
  item: {
    alignItems: 'center',
    padding: 10,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  progressBarContainer: {
    marginTop: 20,
    width: '90%',
    position: 'relative',
  },
  progressBar: {
    height: 40,
    borderRadius: 15,
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    lineHeight: 40,
    color: 'black',
    fontWeight: 'bold',
  },
  image: {
    borderRadius: 24,
    width: '100%',
    height: '100%',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackgroundPressable: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '90%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
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
