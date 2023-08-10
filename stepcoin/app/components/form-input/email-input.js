import React from 'react'
import {View, Text, TextInput} from 'react-native'
import tw from 'twrnc'



export function EmailInput({value, error, ...props}) {


  return (
    <View style={tw`flex flex-col gap-3 w-full`}>
        <Text style={tw`font-semibold text-gray-500`}>Email</Text>
        <TextInput
            style={tw.style('border border-gray-500 rounded-lg px-2 py-4 w-full',
                error ? 'border-red-600 bg-rose-100' : 'border-gray-500 bg-white',
            )}
            placeholder="Email" 
            value={value}
            keyboardType='email-address'
            autoCapitalize='none'
            {...props}
        />
        {error ? <Text style={tw`text-red-600 font-bold`}>{error}</Text> : <></>}
        
    </View>
  )
}
