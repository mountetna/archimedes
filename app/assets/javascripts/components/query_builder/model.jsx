import { Component } from 'react'
import { selectModelNames } from '../../selectors/magma'

export default class ModelPredicate extends Component {
  constructor() {
    super()
  }

  renderFilters() {
    return <div className="filter">
      +
    </div>
  }

  update(new_terms) {
    let { position, terms } = this.props
    terms = {
      ...terms,
      ...new_terms
    }
    let { model, filters, action } = terms
    let child = (model && filters && action) ? { type: "record", model } : null
    this.props.update(position, new_terms, child)
  }

  renderArguments(action) {
    return <div className="arguments">
      <Selector defaultValue={ action } 
        showNone="disabled" 
        values={ [ '::all', '::first' ] }
        onChange={ (action) => this.update({ action }) }/>
    </div>
  }

  render() {
    // the model predicate has three terms, model, filters, and action
    let { position, terms, update } = this.props
    let { model, filters, action } = terms

    return <div className='predicate'>
      { 
        model ? this.renderFilters() : null
      }
      {
        model ? this.renderArguments(action) : null
      }
      </div>
  }
}
