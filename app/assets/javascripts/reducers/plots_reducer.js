const plots = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PLOT':
      return {
        ...state,
        [action.plot.id]: action.plot
      }
    case 'REMOVE_PLOT':
      let newState = { ...state }
      delete newState[action.id]
      return newState
    case 'UPDATE_PLOT':
      return {
        ...state,
        [action.plot.id]: action.plot
      }
    default:
      return state
  }
}

export default plots