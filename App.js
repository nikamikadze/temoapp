import React, { useState } from 'react'
import {
  SafeAreaView,
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

const initialImageData = [
  {
    id: '1',
    uri: 'https://cdn0.it4profit.com/s3/cms/image/0c/28/0c2802b2793fe0f6f90a85a7013f7dc3/iphone_15.webp',
    progress: 0,
    total: 50,
  },
  {
    id: '2',
    uri: 'https://cdn0.it4profit.com/s3/cms/image/0c/28/0c2802b2793fe0f6f90a85a7013f7dc3/iphone_15.webp',
    progress: 0,
    total: 30,
  },
  {
    id: '3',
    uri: 'https://cdn0.it4profit.com/s3/cms/image/0c/28/0c2802b2793fe0f6f90a85a7013f7dc3/iphone_15.webp',
    progress: 0,
    total: 50,
  },
  {
    id: '4',
    uri: 'https://cdn0.it4profit.com/s3/cms/image/0c/28/0c2802b2793fe0f6f90a85a7013f7dc3/iphone_15.webp',
    progress: 0,
    total: 30,
  },
  {
    id: '5',
    uri: 'https://cdn0.it4profit.com/s3/cms/image/0c/28/0c2802b2793fe0f6f90a85a7013f7dc3/iphone_15.webp',
    progress: 0,
    total: 50,
  },
  {
    id: '6',
    uri: 'https://cdn0.it4profit.com/s3/cms/image/0c/28/0c2802b2793fe0f6f90a85a7013f7dc3/iphone_15.webp',
    progress: 0,
    total: 30,
  },
]

const screenWidth = Dimensions.get('window').width

export default function App() {
  const [data, setData] = useState(initialImageData)

  const incrementProgress = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, progress: Math.min(item.progress + 1, item.total) }
          : item
      )
    )
  }

  const renderItem = ({ item }) => (
    <>
      <View style={styles.item}>
        <View style={styles.imgContainer}>
          <Image source={{ uri: item.uri }} style={styles.image} />

          {item.p2rogress === item.total && (
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
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={item.progress / item.total}
              color='#73fc03'
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>
              {item.progress}/{item.total}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => incrementProgress(item.id)}
            >
              <Text style={styles.buttonText}>Add 1</Text>
            </TouchableOpacity>

            {item.progress === item.total && (
              <Button
                title='Done Deal'
                onPress={() => alert('DONE!')}
                style={styles.addButton}
              />
            )}
          </View>
        </View>
        <View style={styles.border}></View>
      </View>
    </>
  )

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={{ fontSize: 20, fontWeight: 700 }}>ჯგუფური</Text>
    </View>
  )
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={styles.flatList}
        ListHeaderComponent={renderHeader}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
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
  border: {
    backgroundColor: 'black',
    height: 5,
    width: screenWidth - 30,
    marginTop: 15,
  },
  flatList: {
    flexGrow: 1,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
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
