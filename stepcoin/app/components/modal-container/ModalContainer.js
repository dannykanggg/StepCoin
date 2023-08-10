import React from 'react'
import { Button, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";
import tw from 'twrnc'


export default function ModalContainer({isVisible, setIsVisible, children, ...props}) {
  return (
    <Modal isVisible={isVisible}>
      <View style={tw`flex-1 bg-white flex-col rounded-md p-3`}>
        <View style={tw`flex flex-row`}>
          <View style={tw`ml-auto`}>
            <Button 
              title="X"
              onPress={() => setIsVisible(false)}
            />
          </View>
        </View>
        {children}
      </View>
    </Modal>
  )
}
