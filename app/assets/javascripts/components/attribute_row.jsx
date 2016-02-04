
AttributeRow = React.createClass({
  attribute_class: function() {
    var class_name = this.props.attribute.attribute_class.replace('Magma::','')
    return eval(class_name);
  },
  render: function() {
    var AttClass = this.attribute_class();
    return <div className="attribute">
            <div className="name" title={ this.props.attribute.desc }>
             { this.props.attribute.display_name }
            </div>
            <AttClass process={ this.props.process } record={ this.props.record } model={ this.props.model } mode={ this.props.mode } attribute={ this.props.attribute }/>
           </div>
  }
});

module.exports = AttributeRow;
