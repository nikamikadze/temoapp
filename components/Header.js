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
      <TouchableOpacity onPress={() => navigation.navigate('DealList')}>
        <Image
          // source={require('../assets/jgupurilogo.png')}
          style={{ width: 50, height: 50 }}
        />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 36,
          fontFamily: 'MtavruliBold',
          textTransform: 'uppercase',
          color: 'white',
          textAlign: 'center',
          includeFontPadding: false,
          lineHeight: 45,
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
            source={require('../assets/profile.png')}
            style={{ width: 50, height: 50 }}
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
    zIndex: 10,
    height: 70,
    paddingHorizontal: 15,
    flexDirection: 'row',
    position: 'relative',
    width: screenWidth,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0A7075',
  },
})

export default Header
