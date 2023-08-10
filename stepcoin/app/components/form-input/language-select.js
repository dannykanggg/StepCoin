import React,{useMemo, useState, useEffect} from 'react'

import RadioButtonRN from 'radio-buttons-react-native';

import tw from 'twrnc'


export default function LanguageSelect({selectHandler,defaultValue, ...props}) {
    const choices = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'English',
            value: 'en'
        },
        {
            id: '2',
            label: 'Japanese',
            value: 'jp'
        }
    ]), []);

    const [selected, setSelected] = useState()

    useEffect(() => {
        if (selected) {
            selectHandler(selected)
            //console.log("selected", selected)
            //console.log(defaultValue)
        }
    },[selected])

    return (
        <>
            <RadioButtonRN 
                data={choices}
                //initial={gender}
                selectedBtn = {(val) => setSelected(val)}
                style={tw``}
            />

        </>
    )
}
