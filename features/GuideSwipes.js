import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  StatusBar,
} from 'react-native'
import { TabView, SceneMap } from 'react-native-tab-view'
import Pagination from '../components/pagination'
import LastGuide from './LastGuide'
import HomePage from './HomePage'
import { Image } from 'expo-image'

const screenWidth = Dimensions.get('window').width

const Screen1 = () => (
  <Image
    source={require('../assets/intro-1.webp')}
    style={{ width: '100%', height: '100%' }}
  />
)

const Screen2 = () => (
  <Image
    source={require('../assets/intro-2.webp')}
    style={{ width: '100%', height: '100%' }}
  />
)

const Screen3 = () => (
  <Image
    source={require('../assets/intro-3.webp')}
    style={{ width: '100%', height: '100%' }}
  />
)

function GuideSwipes({
  navigation,
  setHasSeenGuide,
  hasSeenGuide,
  setTopAreaColor,
}) {
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
  useEffect(() => {
    if (hasSeenGuide) {
      setTopAreaColor('#0A7075')
    } else {
      setTopAreaColor('#032F30')
    }
  }, [hasSeenGuide])
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
      {!hasSeenGuide && (
        <StatusBar barStyle='light-content' backgroundColor='#032F30' />
      )}
      {hasSeenGuide ? (
        <HomePage navigation={navigation} isDisplayed={true} />
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
    backgroundColor: '#27aae2',
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
