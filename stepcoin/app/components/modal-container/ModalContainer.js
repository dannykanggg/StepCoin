import React from 'react'
import { Button, StyleSheet, Text, View } from "react-native";
import Modal from "react-native-modal";


export default function ModalContainer({isVisible, setIsVisible, children, ...props}) {
  return (
    <Modal isVisible={isVisible}>
      <View className={`flex-1 bg-white flex-col rounded-md p-3`}>
        <View className={`flex flex-row`}>
          <View className={`ml-auto`}>
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
