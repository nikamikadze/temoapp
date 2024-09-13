import React, { useState } from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  View,
  Text,
  Button,
  TouchableOpacity,
} from 'react-native'
import { ProgressBar } from 'react-native-paper'

const screenWidth = Dimensions.get('window').width

export default function ProductDetails({ route }) {
  const { item } = route.params
  const [data, setData] = useState(item)

  const incrementProgress = () => {
    setData((prevData) => {
      return {
        ...prevData,
        progress: Math.min(prevData.progress + 1, prevData.total),
      }
    })
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: 700 }}>ჯგუფური</Text>
      </View>
      <View style={styles.item}>
        <View style={styles.imgContainer}>
          <Image source={{ uri: data.uri }} style={styles.image} />
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={data.progress / data.total}
              color='#73fc03'
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {data.progress}/{data.total}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => incrementProgress(data.id)}
            >
              <Text style={styles.buttonText}>Add 1</Text>
            </TouchableOpacity>

            {data.progress === data.total && (
              <Button
                title='Done Deal'
                onPress={() => alert('DONE!')}
                style={styles.addButton}
              />
            )}
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    width: screenWidth,
    borderBottomWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgContainer: {
    width: '70%',
    position: 'relative',
    height: '70%',
  },

  button: {
    width: screenWidth - 100,
    marginTop: 20,
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
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
    width: '90%',
    position: 'relative',
  },
  progressBar: {
    height: 30,
    borderRadius: 15, // Half of the height for rounded corners
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    lineHeight: 30, // Matches the height of the progress bar for vertical centering
    color: 'black',
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})
