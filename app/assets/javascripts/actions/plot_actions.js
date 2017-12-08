// Module imports.
import {showMessages} from './message_actions';
import {createPlot, destroyPlot, updatePlot} from '../api/plots';
import * as ManifestSelector from '../selectors/plot_selector';

// Remove a plot from the store.
const removePlot = (id) => ({
  type: 'REMOVE_PLOT',
  id
});

export const selectPlot = (id) => ({
  type: 'SELECT_PLOT',
  id
});

export const toggleEditing = (is_editing)=>({
  type: 'TOGGLE_PLOT_EDITING',
  is_editing
});

export const addPlot = (plot) => ({
  type: 'ADD_PLOT',
  plot
});

export const selectPoints = (point_ids) => ({
  type: 'SELECT_POINTS',
  ids: point_ids
});

// Delete a plot from the database and the store.
export const deletePlot = (plot) =>
  (dispatch, getState) => {
    destroyPlot(plot)
      .then(() => {
        dispatch(removePlot(plot.id));
        if (ManifestSelector.getSelectedPlotId(getState()) == plot.id) {
          dispatch(selectPlot(null));
        }
      });
  };

const addEditedPlot = (apiAction) => (plot) =>
  (dispatch) => {
    apiAction(plot)
      .then(plot => {
        dispatch(addPlot(plot));
        dispatch(selectPlot(plot.id));
      })
      .catch(e => {
        e.response.json()
          .then(json => dispatch(showMessages(json.errors)))
      });
  };

// Put to update plot and update in store.
export const savePlot = addEditedPlot(updatePlot);

// Post to create new plot and save in the store.
export const saveNewPlot = addEditedPlot(createPlot);
