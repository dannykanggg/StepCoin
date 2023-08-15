import React from 'react'
import PropTypes from 'prop-types'
import {Button, TouchableOpacity, Text} from 'react-native'


//props:
//children, color variant, etc.


export function SimpleButton({title,style, ...props}) {
    return (
        <TouchableOpacity
            className={'py-2 px-3 rounded-md bg-blue-500 flex items-center ' + style}
            {...props}
        >
            <Text className='text-white text-lg'>
                {title}
            </Text>
            
        </TouchableOpacity>
    )
}


SimpleButton.propTypes = {
    /**
     * title - str
     */
    title: PropTypes.string
}

SimpleButton.defaultProps = {
    title: 'Button'
}

export function CustomButton({children, ...props}) {
    return (
        <TouchableOpacity
            {...props}
        >
            {children}
        </TouchableOpacity>
    )
}


CustomButton.propTypes = {
    /**
     * children - JS element
     */
}

CustomButton.defaultProps = {
    children: <Text>default</Text>
}




export function BackButton({title, ...props}) {
  return (
    <Button 
        title={title}
        {...props}
    />
  )
}

BackButton.propTypes = {
    /**
     * title - str
     */
    title: PropTypes.string
}

BackButton.defaultProps = {
    title: 'Button'
}


