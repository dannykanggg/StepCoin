import React from 'react'
import PropTypes from 'prop-types'
import {View, Text, TextInput} from 'react-native'
import tw from 'twrnc'


export function PasswordInput({value, title, placeholder, error, ...props}) {

  return (
    <View style={tw`flex flex-col gap-3 w-full`}>
      {title ? <Text style={tw`font-semibold text-gray-500`}>{title}</Text> : <></>}
        
        <TextInput
            style={tw.style('border border-gray-500 rounded-lg px-2 py-4 w-full',
                error ? 'border-red-600 bg-rose-100' : 'border-gray-500 bg-white'
            )}
            placeholder={placeholder}
            value={value}
            keyboardType='default'
            autoCapitalize='none'
            secureTextEntry={true}
            {...props}
        />
        {error ? <Text style={tw`text-red-600 font-bold`}>{error}</Text> : <></>}
    </View>
  )
}


PasswordInput.propTypes = {
  /**
   * 
   */
  value: PropTypes.string,
  title: PropTypes.string,
  placeholder: PropTypes.string
}

PasswordInput.defaultProps = {
  title: 'Password',
  placeholder: 'Password'
}
