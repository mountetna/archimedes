import React, { Component } from 'react'
import { connect } from 'react-redux'
import ManifestTitle from './title'
import { submitManifest } from '../../actions/manifest_editor_actions'

const HelperButton = ({ name, onClick , selected }) => (
  <a style={{paddingLeft: 10, paddingRight: 10}} onClick={onClick}>
    { selected ?
      <i className="fa fa-caret-down" aria-hidden="true" style={{paddingRight: 3}}></i> :
      <i className="fa fa-caret-right" aria-hidden="true" style={{paddingRight: 3}}></i> 
    }
    {name}
  </a>
)

class Toolbar extends Component {
  componentDidMount() {
    this.setState({})
  }

  changeSelectedHelper(helper) {
    const selectedHelper = this.state.selectedHelper === helper ? undefined : helper
    this.setState({...this.state, selectedHelper: selectedHelper})
  }
  //TODO add helpers to generate table queries etc...
  helperButtons() {
    return []//['Table', 'Query', 'Functions', 'View Schema']
      .map( helper => {
        const isSelected = this.state ? this.state.selectedHelper === helper : false
        return (
          <HelperButton 
            name={helper} key={helper} 
            onClick={() => this.changeSelectedHelper(helper)} 
            selected={isSelected} 
          />
        ) 
      })
  }

  render() {
    const style = {
      display: 'flex', 
      justifyContent:'flex-start', 
      background:'linear-gradient(to top, #A5CF97, white)', 
      height: 30, 
      alignItems:'center',
      borderStyle: 'solid',
      boxSizing: 'border-box',
      borderWidth: 1,
      width: '100%',
      color: 'forestgreen'
    }

    return (
      <div style={style}>
        <ManifestTitle />
        { this.helperButtons() }
        <div style={{flexGrow:1, display:'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
          <div style={{marginRight: 5, borderWidth: 1, padding: 3}} value='add manifest' onClick={this.props.submitManifest}>
            Run
            <i className="fa fa-play" aria-hidden="true" style={{marginLeft: 3}}></i>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  null, 
  { submitManifest }
)(Toolbar)