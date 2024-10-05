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

  useEffect(() => {
    if (isDisplayed) {
      dealsService.getList().then((res) => {
        console.log('got list')

        setDealList(res.deals)
      })
    }
  }, [])

  const renderItem = ({ item }) => (
    <>
      <ImageBackground
        source={{ uri: `http://192.168.0.3:5000${item.imageUrl}` }}
        style={styles.item}
      >
        <TouchableOpacity
          style={styles.imgContainer}
          onPress={() =>
            navigation.navigate('Details', {
              deal: item,
            })
          }
        >
          {item.progressCount === item.totalCount && (
            <Image
              source={{
                uri: 'https://pngimg.com/uploads/sold_out/sold_out_PNG73.png',
              }}
              style={{
                width: 100,
                height: 40,
                position: 'absolute',
                top: screenWidth / 4 + 10,
                left: screenWidth / 4 - 10,
              }}
            />
          )}
        </TouchableOpacity>
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
          style={{ marginTop: 15 }}
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

  const renderHeader = () => (
    <View style={styles.header}>
      <Text
        style={{ fontSize: 20, fontWeight: 700 }}
        onPress={() => alert('123')}
      >
        ჯგუფური
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={{
          position: 'absolute',
          right: 20,
        }}
      >
        <Image
          source={{
            uri: 'https://static-00.iconduck.com/assets.00/profile-icon-512x512-w0uaq4yr.png',
          }}
          style={{ width: 30, height: 30 }}
        />
      </TouchableOpacity>
    </View>
  )
  return (
    <View style={styles.container}>
      <FlatList
        data={dealList}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={1}
        contentContainerStyle={styles.flatList}
        ListHeaderComponent={renderHeader}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgb(170,226,255)' },
  header: {
    height: 70,
    flexDirection: 'row',
    position: 'relative',
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
  border: {
    backgroundColor: 'black',
    height: 8,
    width: screenWidth,
    marginTop: 15,
  },
  flatList: {
    flexGrow: 1,
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
