import React from 'react'
import { View, ScrollView } from 'react-native'

//screenview
//bodyview


export function ScreenView({children, className, ...props}) {
  return (
    <View 
      className={`flex flex-1`+ className }
      {...props}
    >
      {children}
    </View>
  )
}

export function BodyView({children, className, ...props}) {
  return (
    <ScrollView >
      <View 
        className={className}
        {...props}
      >
        {children}
      </View>
    </ScrollView>
  )
}

