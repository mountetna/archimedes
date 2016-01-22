Plotter = React.createClass({
  componentDidMount: function() {
    var self = this;

    $.get( Routes.plot_types_json_path(), function(result) {
      self.data_update(result);
    });
  },
  data_update: function(result) {
    this.setState( { mode: 'plot', template: result.template, plot_types: result.plots, saves: $.extend(this.default_saves, result.saves ) } );
  },
  default_saves: {
    series: {},
    mappings: {},
    plots: {}
  },
  getInitialState: function() {
    return { mode: 'loading', plots: [],
        saves: this.default_saves, 
    };
  },
  create_plot: function() {
    var node = $(React.findDOMNode(this));
    var name = node.find('select[name=plot_type]').val();
    var plot_type = this.state.plot_types.find(function(p) { return p.type == name });
    var plots = this.state.plots;
    plots.push({
      template: plot_type,
      name: plot_type.name,
      type: plot_type.type
    });
    this.setState( { plots: plots } );
  },
  remove_plot: function(plot) {
    var plots = this.state.plots;
    var index = plots.indexOf(plot);
    if (index != -1) plots.splice(index,1)
      this.setState( { plots: plots } );
  },
  plot_handler: function(command, plot) {
    if (command == 'close') {
      this.remove_plot(plot);
    }
  },
  create_variable: function(var_type) {
    // get the existing saves
    saves = this.state.saves;
    v = this.new_var();
    saves[var_type][v.key] = v;
    console.log(saves);
    this.setState({ saves: saves });
  },
  update_variable: function(var_type, key, prop, value) {
    saves = this.state.saves;
    console.log(saves);
    console.log(key);
    if (prop == 'remove')
      delete saves[var_type][key];
    else
      saves[var_type][key][prop] = value;
    this.setState({ saves: saves });
  },
  new_var: function() {
    return { key: Math.random().toString(36).substring(7) };
  },
  render: function() {
    var token = $( 'meta[name="csrf-token"]' ).attr('content');
    var self = this;
    if (this.state.mode == 'loading')
      return <div></div>;
    else {
      return <div className="plotter">
                <PlotVariables create={ this.create_variable } 
                  update={ this.update_variable }
                   saves={ this.state.saves }
                   template={ self.state.template } />
                <div className="create">
                  Plot type: 
                  <select name="plot_type" defaultValue="none">
                  {
                    this.state.plot_types.map(
                      function(plot_type) {
                        return <option key={plot_type.name} value={plot_type.type} >{ plot_type.name }</option>;
                      }
                    )
                  }
                  </select>
                  <input type="button" onClick={ this.create_plot } value="Add"/>
                </div>
 
                {
                  this.state.plots.map(function(plot) {
                    var PlotClass = eval(plot.type);
                    return <PlotClass plot={ plot } 
                      saves={ self.state.saves }
                      handler={ self.plot_handler } />;
                  })
                }
             </div>
    }
  }
});
