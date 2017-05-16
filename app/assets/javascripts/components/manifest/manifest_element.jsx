import React from 'react'
import Script from './script'
import HideableText from "./hideable_text"
import { Result } from "./manifest_results"

const ManifestElement = ({ name, script, description, result}) => (
  <div className="element">
    <div className='name'>@{name}</div>
    <div className='equals'>=</div>
    {Script(script)}
    {Result(name, result)}
  </div>
)

export default ManifestElement
