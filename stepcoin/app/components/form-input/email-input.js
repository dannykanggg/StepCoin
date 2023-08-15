import React from 'react'
import {View, Text, TextInput} from 'react-native'


export function EmailInput({value, error, ...props}) {

  const errorStyle = error ? 'border-red-600 bg-rose-100' : 'border-gray-500 bg-white'

  return (
    <View className='flex flex-col gap-3 w-full'>
        <Text className='font-semibold text-gray-500'>Email</Text>
        <TextInput
            className={`border border-gray-500 rounded-lg px-2 py-4 w-full ` + errorStyle }
            placeholder="Email" 
            value={value}
            keyboardType='email-address'
            autoCapitalize='none'
            {...props}
        />
        {error ? <Text className='text-red-600 font-bold'>{error}</Text> : <></>}
        
    </View>
  )
}
