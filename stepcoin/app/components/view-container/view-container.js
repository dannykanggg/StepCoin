import React from 'react'
import { View, ScrollView } from 'react-native'
import tw from 'twrnc'

//screenview
//bodyview


export function ScreenView({children, style, ...props}) {
  return (
    <View 
      style={[tw`flex flex-1`, style]}
      {...props}
    >
      {children}
    </View>
  )
}

export function BodyView({children, style, ...props}) {
  return (
    <ScrollView
      style={[tw``, style]}
      {...props}
    >
      {children}
    </ScrollView>
  )
}

