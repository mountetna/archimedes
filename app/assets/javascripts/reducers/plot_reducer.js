
plotReducer = function(state, action) {
  if (!state) state = [];
  console.log(state);
  console.log(action);
  switch(action.type) {
    case 'CREATE_NEW_PLOT':
      return state.concat( {
        plot_id: action.plot_id,
        type: action.plot_type,
        requested_series: [],
        requested_mappings: [],
        analysis: action.analysis
      }
      );
    case 'UPDATE_REQUESTED_SERIES':
      return state.map(function(plot) {
        if (plot.plot_id == action.plot_id) {
          return $.extend(plot, {
            requested_series: action.requested_series 
          })
        }
        return plot;
      });
    case 'UPDATE_REQUESTED_MAPPINGS':
      return state.map(function(plot) {
        if (plot.plot_id == action.plot_id) {
          return $.extend(plot, {
            requested_mappings: action.requested_mappings 
          })
        }
        return plot;
      });
    case 'ADD_PLOT_DATA':
      return state.map(function(plot) {
        if (plot.plot_id == action.plot_id) {
          return $.extend(plot, {
            series: action.series,
            analyses: action.analyses,
            data_key: Math.random().toString(36).substring(7)
          })
        }
        return plot;
      });
    case 'CANCEL_PLOT_CONFIG':
      return state.map(function(plot) {
        if (plot.plot_id == action.plot_id) {
          return $.extend(plot, {
            requested_series: plot.series || [],
            requested_mappings: plot.mappings || [],
          })
        }
        return plot;
      });
    case 'CLOSE_PLOT':
      return state.filter(function(plot) {
        return plot.plot_id != action.plot_id;
      });
    default:
      return state;
  }
}


