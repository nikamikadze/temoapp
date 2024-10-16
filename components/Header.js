import React from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import useAuthStore from '../zustand/auth'
const screenWidth = Dimensions.get('window').width

const Header = ({ navigation, hasRightIcon = true }) => {
  const { isSignedIn } = useAuthStore()

  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/jgupurilogo.png')}
        style={{ width: 50, height: 50 }}
        onPress={() => navigation.navigate('DealList')}
      />
      <Text
        style={{
          fontSize: 36,
          fontFamily: 'MtavruliBold',
          textTransform: 'uppercase',
        }}
        onPress={() => navigation.navigate('DealList')}
      >
        ჯგუფური
      </Text>
      {hasRightIcon ? (
        <TouchableOpacity
          onPress={() => {
            if (isSignedIn) navigation.navigate('Profile')
            else alert('დარეგისტრირდით პროფილის გასახსნელად')
          }}
        >
          <Image
            source={{
              uri: 'https://static-00.iconduck.com/assets.00/profile-icon-512x512-w0uaq4yr.png',
            }}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 30, height: 30 }}></View>
      )}
    </View>
  )
}
const styles = StyleSheet.create({
  header: {
    height: 70,
    paddingHorizontal: 15,
    flexDirection: 'row',
    position: 'relative',
    width: screenWidth,
    borderBottomWidth: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default Header
