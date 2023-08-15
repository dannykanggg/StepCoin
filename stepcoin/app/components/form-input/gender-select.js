import React from 'react'

import RadioButtonRN from 'radio-buttons-react-native';

export default function GenderSelect({genderOptions, gender,setGender, ...props}) {
    

    return (
        <RadioButtonRN 
            data={genderOptions.map((m) => {return {label: m}})}
            //initial={gender}
            selectedBtn = {(val) => setGender(val)}
            {...props}
        />
    )
}
