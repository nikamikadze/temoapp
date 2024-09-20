import React, { useState } from 'react'
import { View, StyleSheet, Dimensions, Text, StatusBar } from 'react-native'
import { TabView, SceneMap } from 'react-native-tab-view'
import Pagination from '../components/pagination'
import LastGuide from './LastGuide'
import HomePage from './HomePage'

const screenWidth = Dimensions.get('window').width

const Screen1 = () => (
  <View style={[styles.container]}>
    <Text style={styles.text}>Screen 1</Text>
  </View>
)

const Screen2 = () => (
  <View style={[styles.container]}>
    <Text style={styles.text}>Screen 2</Text>
  </View>
)

const Screen3 = () => (
  <View style={[styles.container]}>
    <Text style={styles.text}>Screen 3</Text>
  </View>
)

function GuideSwipes({ navigation, setHasSeenGuide, hasSeenGuide }) {
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'screen1', title: 'Screen 1' },
    { key: 'screen2', title: 'Screen 2' },
    { key: 'screen3', title: 'Screen 3' },
    { key: 'screen4', title: 'Screen 4' },
  ])

  const handleSwipeUp = () => {
    setHasSeenGuide(true)
  }

  const renderScene = SceneMap({
    screen1: Screen1,
    screen2: Screen2,
    screen3: Screen3,
    screen4: () => <LastGuide onSwipeUp={handleSwipeUp} />,
  })

  const renderTabbar = () => {
    return <></>
  }

  return (
    <View style={styles.mainContainer}>
      {hasSeenGuide ? (
        <HomePage navigation={navigation} />
      ) : (
        <>
          <TabView
            navigationState={{ index, routes }}
            renderTabBar={renderTabbar}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: screenWidth }}
            style={styles.tabView}
          />
          <Pagination index={index} count={routes.length} />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgb(170,226,255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'white',
  },
  tabView: {
    flex: 1,
  },
})

export default GuideSwipes
