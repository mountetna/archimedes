TableColumn = function(attribute,template) {
  var self = this;

  var att_class = attribute.attribute_class

  this.name = attribute.name

  this.shown = attribute.shown
  
  this.format = function(value) {
    // this returns a plain text or number version of this attribute,
    // suitable for searching
    if (value == undefined) return ""

    switch(att_class) {
      // how to search:
      case "TableAttribute":
        return "";
      case "LinkAttribute":
        return value || "";
      case "SelectAttribute":
      case "Attribute":
        return value;
      case "DateTimeAttribute":
        var date = new Date(value);
        var hours = ('00' + date.getHours()).slice(-2);
        var minutes = ('00' + date.getMinutes()).slice(-2);
        return $.datepicker.formatDate( 'yy-mm-dd', date ) + '@' + hours + ':' + minutes;
      case "CheckboxAttribute":
        return value ? "true" : "false";
      case "DocumentAttribute":
      case "ImageAttribute":
        return value.path
      case "CollectionAttribute":
        return value.join(",");
      case "IntegerAttribute":
      case "FloatAttribute":
        return value || 0;
      default:
        console.log("Couldn't find "+att_class);
        return value || "";
    }
  };

  this.render = function(document, mode) {
    // this returns a react class displaying the given value for 
    // this attribute
    
    if (att_class == "TableAttribute")
      return <div className="value"> (table) </div>;

    var AttClass = eval(att_class);

    return <AttClass document={ document } 
      template={ template }
      value={ document[ attribute.name ] }
      mode={ mode } 
      attribute={ attribute }/>
  }
};

module.exports = TableColumn;
