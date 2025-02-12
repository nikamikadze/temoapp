  import { LinearGradient } from 'expo-linear-gradient'
  import { useState } from 'react'
  import { Animated, Text, TouchableOpacity, View } from 'react-native'

  export const ExpandableText = ({ text, maxHeight = 100 }) => {
    const [expanded, setExpanded] = useState(false)
    const fadeAnim = new Animated.Value(1)

    const handleExpand = () => {
      if (expanded) {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start()
      } else {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start()
      }
      setExpanded(!expanded)
    }

    return (
      <View style={{ width: '90%', margin: 20, position: 'relative' }}>
        <View
          style={{
            maxHeight: expanded ? undefined : maxHeight,
            overflow: 'hidden',
          }}
        >
          <Animated.Text
            style={{
              fontSize: 16,
              color: 'white',
              fontFamily: 'MtavruliBold',
              textTransform: 'uppercase',
              opacity: expanded ? 1 : fadeAnim, // Smooth fade effect for text
              flexShrink: 1, // Ensures text can shrink properly when expanding
            }}
          >
            {text}
          </Animated.Text>
        </View>

        {!expanded && (
          <LinearGradient
            colors={['rgba(12, 150, 156, 0.3)', 'rgba(13, 136, 143, 1)']}
            style={{
              position: 'absolute',
              bottom: 30,
              left: 0,
              right: 0,
              height: 40, // Taller fade effect for a smoother transition
            }}
          />
        )}

        <TouchableOpacity
          onPress={handleExpand}
          style={{
            alignSelf: 'center',
            paddingVertical: 6,
          }}
        >
          <Text
            style={{
              color: '#ffcc00',
              fontSize: 14,
              fontWeight: 'bold',
              letterSpacing: 0.5,
            }}
          >
            {expanded ? 'Show Less ▲' : 'Show More ▼'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
