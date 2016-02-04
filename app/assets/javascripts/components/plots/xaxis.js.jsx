XAxis = React.createClass({
  render: function() {
    var self = this;
    var scale = this.props.scale;
    var ticks = scale.ticks(this.props.num_ticks);
    var interval_size = ticks[1] - ticks[0];
    var places = Math.ceil(-Math.log10(Math.abs(interval_size)));

    return <g className="axis">
      <text textAnchor="middle" transform={ 'translate(' + (scale(this.props.xmin)+scale(this.props.xmax))/2 + ',' + (this.props.y + 35) + ')' }>
        { this.props.label }
      </text>
      <line 
            y1={ this.props.y }
            x1={ scale(this.props.xmin) }
            y2={ this.props.y }
            x2={ scale(this.props.xmax) }/>
      {
        ticks.map(function(tick) {
          var x = self.props.scale(tick);
          return <g>
              <text textAnchor="middle" 
                transform={ 
                  'translate(' + x + ',' + (self.props.y + self.props.tick_width + 10) + ')' }>
                    { tick.toFixed(places) }
              </text>
              <line y1={ self.props.y }
                  x1={ x }
                  y2={ self.props.y + self.props.tick_width }
                  x2={ x }/>
            </g>
        })
      }
    </g>;
  }
});
