import React from 'react'
import {StyleSheet, View} from 'react-native'

import CircularProgress from 'react-native-circular-progress-indicator';


export default function CircularProgressRing() {
  return (
    <View style={{padding: 5}}>
      <CircularProgress 
          radius={50}
          activeStrokeWidth={16}
          value={85}
          
          progressValueColor={'black'}
          valueSuffix={'%'}
          inActiveStrokeColor={'#2ecc71'}
          inActiveStrokeOpacity={0.2}
      />
    </View>
  )
}


const styles = StyleSheet.create({

})