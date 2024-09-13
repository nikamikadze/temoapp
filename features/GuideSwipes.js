import React, { useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native'
import { TabView, SceneMap } from 'react-native-tab-view'
import Pagination from '../components/pagination' // Adjust the import path

const screenWidth = Dimensions.get('window').width

const Screen1 = () => (
  <View style={[styles.container, { backgroundColor: 'red' }]}>
    <Text style={styles.text}>Screen 1</Text>
  </View>
)

const Screen2 = () => (
  <View style={[styles.container, { backgroundColor: 'blue' }]}>
    <Text style={styles.text}>Screen 2</Text>
  </View>
)

const Screen3 = () => (
  <View style={[styles.container, { backgroundColor: 'green' }]}>
    <Text style={styles.text}>Screen 3</Text>
  </View>
)

const Screen4 = ({ navigation }) => (
  <View style={[styles.container, { backgroundColor: 'yellow' }]}>
    <Text style={styles.text}>Screen 4</Text>
    <Button onPress={() => navigation.navigate('Home')} title='Home Page' />
  </View>
)

const initialLayout = { width: screenWidth }

function GuideSwipes({ navigation }) {
  const [index, setIndex] = useState(0)
  const [routes] = useState([
    { key: 'screen1', title: 'Screen 1' },
    { key: 'screen2', title: 'Screen 2' },
    { key: 'screen3', title: 'Screen 3' },
    { key: 'screen4', title: 'Screen 4' },
  ])

  const renderScene = SceneMap({
    screen1: Screen1,
    screen2: Screen2,
    screen3: Screen3,
    screen4: () => <Screen4 navigation={navigation} />,
  })
  const renderTabbar = () => {
    return <></>
  }
  return (
    <View style={styles.mainContainer}>
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabbar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        style={styles.tabView}
      />
      <Pagination index={index} count={routes.length} />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
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
