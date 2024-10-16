import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Button, ProgressBar } from 'react-native-paper'
import dealsService from '../api/deals'
import Header from '../components/Header'
const screenWidth = Dimensions.get('window').width

export default function DealHistory({ route, navigation }) {
  const { category } = route.params
  const [userDeals, setUserDeals] = useState([])

  useEffect(() => {
    dealsService.userDeals(category).then((res) => {
      console.log(res)
      setUserDeals(res)
    })
  }, [])

  const renderItem = ({ item }) => (
    <View
      style={{
        height: screenWidth / 1.3,
        alignItems: 'center',
      }}
    >
      <View style={styles.description}>
        <Image
          source={{ uri: `http://192.168.1.111:5000${item.imageUrl}` }}
          style={styles.image}
        />
        <View style={{ width: '55%', gap: 15 }}>
          <Text style={styles.descrText}>{item.description}</Text>
          <Text style={styles.price}>{item.price.toFixed(2)}₾</Text>
          {category === 'active' && (
            <Text style={{ color: 'red' }}>დარჩენილია: 13:05:23</Text>
          )}
          {category === 'canceled' && (
            <Text style={{ color: 'red' }}>დრო ამოიწურა!</Text>
          )}
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <ProgressBar
          progress={item.progressCount / item.totalCount}
          color='#652d90'
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>
          {item.progressCount}/{item.totalCount}
        </Text>
      </View>
      {category === 'active' && (
        <Button
          style={{ width: '50%', marginVertical: 'auto' }}
          mode='contained'
        >
          აღარ მინდა
        </Button>
      )}
    </View>
  )
  const renderHeader = () => (
    <Header navigation={navigation} hasRightIcon={false} />
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={userDeals}
        renderItem={renderItem}
        keyExtractor={(item) => item.dealId}
        numColumns={1}
        contentContainerStyle={styles.flatList}
        ListHeaderComponent={renderHeader}
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
  description: {
    width: '100%',
    height: '70%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  descrText: {
    width: '95%',
    fontSize: 16,
    lineHeight: 24,
  },

  price: {
    fontSize: 24,
    lineHeight: 24,
    color: 'white',
    textShadowColor: 'rgb(0, 0, 0)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
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
