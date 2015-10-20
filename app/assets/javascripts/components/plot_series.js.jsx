PlotSeries = React.createClass({
  getInitialState: function() {
    return { chain_state: {} }
  },
  render_plot: function() {
    var indication, clinical;
    if (!this.props.current)
      indication = <span>undefined</span>;
    else {
      if (this.props.current.indication)
        indication = <span> Indication: { this.props.current.indication }</span>;
      if (this.props.current.clinical_value)
        clinical = <span> Clinical: { this.props.current.clinical_name } = { this.props.current.clinical_value }</span>;
    }
    return <div className="series">
          <span className="title">Series</span>
          { indication }
          { clinical }
        </div>;
  },
  render: function() {
    var self = this;
    if (this.props.mode == 'plot')
      return this.render_plot();
    else {
      return <div className="series edit">
            <span className="title">Series</span>
            <ColorPicker label="Color" onChange={ this.update_color }/>
            <ChainSelector name="indication"
                label="Indication"
                change={ this.update_chain }
                values={ this.props.template.indications }
                showNone="disabled"
                defaultValue={ this.props.current ? this.props.current.indication : null }
                chain_state={ this.state.chain_state }/>
            <ChainSelector
                name="clinical_name"
                label="Clinical Variable"
                depends={ [ "indication" ] }
                values={ this.props.template.clinicals }
                change={ this.update_chain }
                defaultValue={ this.props.current ? this.props.current.clinical_name : null }
                showNone="enabled"
                chain_state={ this.state.chain_state } />
            <ChainSelector
                name="clinical_value"
                label="Value"
                showNone="disabled"
                depends={ [ "indication", "clinical_name" ] }
                values={ this.props.template.clinicals }
                defaultValue={ this.props.current ? this.props.current.clinical_value : null }
                change={ this.update_chain }
                chain_state={ this.state.chain_state } />
          </div>;
    }
  },
  update_color: function(color) {
    this.update_chain('color', color.toRgb());
  },
  update_chain: function(name, value) {
    current_chain = this.state.chain_state;
    current_chain[ name ] = value;
    console.log(current_chain);
    this.setState({ chain_state: current_chain });
    this.props.update_query(this.props.name, current_chain);
  },
})
