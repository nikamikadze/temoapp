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

const screenWidth = Dimensions.get('window').width

export default function ProductDetails({ route, navigation }) {
  const { deal } = route.params

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>ჯგუფური</Text>
      </View>
      <View style={styles.item}>
        <View style={styles.imgContainer}>
          <Image
            source={{ uri: `http://192.168.0.3:5000${deal.imageUrl}` }}
            style={styles.image}
          />
        </View>
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
    backgroundColor: 'rgb(170,226,255)',
  },
  header: {
    height: 70,
    width: screenWidth,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 16,
    fontWeight: 'bold',
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
