import React,{useState,useEffect} from 'react'

import { View,Text } from 'react-native'

import SelectDropdown from 'react-native-select-dropdown'


export default function BirthdayInput({birthday, setBirthday, ...props}) {

    const [monthOptions, setMonthOptions] = useState([])
    const [dayOptions, setDayOptions] = useState([])
    const [yearOptions, setYearOptions] = useState([])

    const {month, day, year} = birthday

    useEffect(() => {
        //set month
        for (let i=1; i<13;i++) {
            setMonthOptions((prev) =>[...prev, i.toString()])
        }
        //set day
        for (let i=1; i<32;i++) {
            setDayOptions((prev) =>[...prev, i.toString()])
        }
        //set year
        const endYear = new Date().getFullYear()
        for (let i=0; i<111; i++) {
            const thisYear = endYear - i
            setYearOptions((prev) => [...prev, thisYear.toString()])
        }
    },[])

    //adjust day options based on month and year
    useEffect(() => {
        if (month && year) {
            const maxDay = (new Date(year, month, 0)).getDate()
            const dayList =[]
            for (let i=1; i<maxDay+1; i++) {
                dayList.push(i.toString())
            }
            setDayOptions(dayList)
            //if day is greater than month's max day, set to real max day
            if (day) {
                if (day > maxDay) {
                    setBirthday((prev) => ({...prev, day:maxDay.toString()}))
                }
            }
        }
    },[month, year])




    return (
        <View className='flex flex-row'>
            <View className-='flex flex-col'>
                <Text>Month</Text>
                <SelectDropdown 
                    data={monthOptions}
                    onSelect={(val, index) => setBirthday((prev) => ({...prev, month:val}))}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    buttonStyle={{width: '6rem'}}
                />
            </View>
            <View className='flex flex-col'>
                <Text>Day</Text>
                <SelectDropdown 
                    data={dayOptions}
                    onSelect={(val, index) => setBirthday((prev) => ({...prev, day:val}))}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    buttonStyle={{width: '6rem'}}
                />
            </View>
            <View className='flex flex-col'>
                <Text>Month</Text>
                <SelectDropdown 
                    data={yearOptions}
                    onSelect={(val, index) => setBirthday((prev) => ({...prev, year:val}))}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    buttonStyle={{width: '9rem'}}

                />
            </View>
        </View>
    )
}
