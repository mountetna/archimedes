import { combineReducers } from 'redux'

const title = (state = '', action) => {
  switch (action.type) {
    case 'CLEAR_EDITOR':
      return ''
    case 'SELECT_MANIFEST':
      return action.name
    case 'UPDATE_MANIFEST_TITLE':
      return action.title
    default:
      return state
  }
}

const isManifestSelectorVisible = (state = false, action) => {
  switch (action.type) {
    case 'SELECT_MANIFEST':
      return false
    case 'TOGGLE_IS_MANIFEST_SELECTOR_VISIBLE':
      return !state
    default:
      return state
  }
}

const isUpdatingTitle = (state = false, action) => {
  switch (action.type) {
    case 'SELECT_MANIFEST':
    case 'CLEAR_EDITOR':
      return false
    case 'TOGGLE_IS_TITLE_UPDATING':
      return !state
    default:
      return state
  }
}

const isAddingManifestElement = (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE_IS_ADDING_MANIFEST_ELEMENT':
      return !state
    default:
      return state
  }
}

const selectedManifestElement = (state = '', action) => {
  switch (action.type) {
    case 'CLEAR_EDITOR':
    case 'SELECT_MANIFEST':
      return ''
    case 'SELECT_MANIFEST_ELEMENT':
      return action.key
    default:
      return state
  }
}

const updatingElementList = (state = [], action) => {
  switch (action.type) {
    case 'CLEAR_EDITOR':
    case 'SELECT_MANIFEST':
      return []
    case 'ADD_TO_UPDATING_LIST':
      return [...state, action.key]
    case 'REMOVE_FROM_UPDATING_LIST':
      return state.filter(key => key !== action.key)
    default:
      return state
  }
}

const manifest = (state = {}, action) => {
  switch (action.type) {
    case 'SELECT_MANIFEST':
      return action.manifest
    case 'ADD_MANIFEST_ELEMENT':
      return {...state, [action.key]: action.value}
    case 'DELETE_MANIFEST_ELEMENT':
      let newState = {...state}
      delete newState[action.key]
      return newState
    default:
      return state
  }
}

export default combineReducers({
  title,
  isUpdatingTitle,
  isAddingManifestElement,
  isManifestSelectorVisible,
  selectedManifestElement,
  updatingElementList,
  manifest
})