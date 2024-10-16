import React from 'react'
import {
  Image,
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { ProgressBar, Button } from 'react-native-paper'
import Header from '../components/Header'

const screenWidth = Dimensions.get('window').width

export default function ProductDetails({ route, navigation }) {
  const { deal } = route.params

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <View style={styles.item}>
        <View style={styles.imgContainer}>
          <Image
            source={{ uri: `http://192.168.1.111:5000${deal.imageUrl}` }}
            style={styles.image}
          />
        </View>
        <Text
          style={{
            fontSize: 16,
            margin: 10,
            color: 'white',
            fontFamily: 'MtavruliBold',
            textTransform: 'uppercase',
          }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime dolore
          commodi alias laborum neque iusto voluptas error corporis quis
          doloribus explicabo aspernatur numquam doloremque, asperiores libero
          dolorem
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={deal.progressCount / deal.totalCount}
              color='#652d90'
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

            {deal.progressCount === deal.totalCount && (
              <Button
                title='Done Deal'
                onPress={() => alert('DONE!')}
                style={styles.addButton}
              />
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#27aae2',
  },

  imgContainer: {
    width: screenWidth - 30,
    position: 'relative',
    height: screenWidth - 30,
  },
  button: {
    width: screenWidth - 100,
    marginTop: 20,
    backgroundColor: '#ed008c',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 24,
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
    flex: 1,
    alignItems: 'center',
    borderRadius: 12,
    width: screenWidth,
    height: screenWidth,
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
