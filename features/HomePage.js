import React, { useState } from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  View,
  Text,
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

export default function App({ navigation }) {
  const renderItem = ({ item }) => (
    <>
      <View style={styles.item}>
        <TouchableOpacity
          style={styles.imgContainer}
          onPress={() =>
            navigation.navigate('Details', {
              item: item,
            })
          }
        >
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
        </TouchableOpacity>
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
    <FlatList
      data={initialImageData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={1}
      contentContainerStyle={styles.flatList}
      ListHeaderComponent={renderHeader}
    />
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
  border: {
    backgroundColor: 'black',
    height: 5,
    width: screenWidth - 30,
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
