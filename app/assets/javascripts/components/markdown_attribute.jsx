var MarkdownAttribute = React.createClass({
  render: function() {
    var store = this.context.store
    var self = this
    if (this.props.mode == "edit") {
      return <div className="value">
              <textarea className="text_box" 
                onChange={
                  function(e) {
                    store.dispatch(
                      magmaActions.reviseDocument(
                        self.props.document,
                        self.props.template,
                        self.props.attribute,
                        e.target.value
                      )
                    )
                  }
                }
                defaultValue={ this.props.revision } />
             </div>
    }

    var content = marked(this.props.value)
    return <div className="value"
        dangerouslySetInnerHTML={ { __html: content } }/>
  }
})

MarkdownAttribute.contextTypes = {
  store: React.PropTypes.object
}

module.exports = MarkdownAttribute
