import React from 'react'
import RadioSelector from '../form_inputs/radio_selector'

const ManifestAccess = ({ selectedDefault = null, handleSelect, label = 'Access' }) => {
  const props = {
    options: ['private', 'public'],
    selected: selectedDefault,
    handleSelect,
    label
  }
  return <RadioSelector {...props} />
}

export default ManifestAccess

