var BrowserDisplay = React.createClass({
  componentDidMount: function() {
    var self = this
    this.props.request(function() { self.setState({mode: 'browse'}) })
  },
  getInitialState: function() {
    return { mode: 'loading', can_edit: null }
  },
  update_form: function() {
    var node = $(React.findDOMNode(this));
    var submission = new FormData(node[0])
    // we need to fix some entries in our submission.
    this.update_form_tokens(submission);
    $.ajax({
      type: "POST",
      url: node.attr('action'), //sumbits it to the given url of the form
      data: submission,
      dataType: "JSON",
      success: this.data_update,
      error: this.update_errors,
      cache: false,
      contentType: false,
      processData: false
    });
    return false;
  },
  update_errors: function(result) {
    var store = this.context.store;
    result = result.responseJSON;
    this.handle_mode( 'edit' );
    if (result && result.errors)
      this.props.showMessage(results.errors);
    else
      this.props.showMessage( ["### An unknown error occurred."] );
  },
  header_handler: function(action) {
    switch(action) {
      case 'cancel':
        this.setState({mode: 'browse'})
        this.props.discardRevision()
        self.form_tokens = {};
        return
      case 'approve':
        this.setState({mode: 'submit'})
        this.submit_edit()
        return
      case 'edit':
        console.log('setting state to edit')
        this.setState({mode: 'edit'})
        return
    }
  },
  render: function() {
    var self = this
    var token = $( 'meta[name="csrf-token"]' ).attr('content')
    if (this.state.mode == 'loading')
      return <div className="browser">
                <span className="fa fa-spinner fa-pulse"/>
             </div>
    else {
      var displayed_attributes = this.state.mode == "browse" ?
        self.props.patched_attributes : self.props.attributes
      var skin = this.state.mode == "browse" ?
        "browser " + this.props.skin_name : "browser"
      return <div className={ skin }>

        <Header mode={ this.state.mode } handler={ this.header_handler } can_edit={ true }>
          { this.props.template.name }
        </Header>

        <div id="attributes">
        {
          displayed_attributes.map(function(att) {
            return <div key={att.name} className="attribute">
              <div className="name" title={ att.desc }>
               { att.display_name }
              </div>
            <AttributeViewer 
              mode={self.state.mode}
              template={ self.props.template }
              document={ self.props.document }
              value={ self.props.document[ att.name ] }
              revision={ self.props.revision.hasOwnProperty(att.name) ? self.props.revision[ att.name ] : self.props.document[ att.name ] }
              attribute={att}/>
            </div>
          })
        }
        </div>
      </div>
    }
  }
})

var filterAttributes = function(template) {
  var atts = []
  if (template) {
    Object.keys( template.attributes ).forEach(
      function(att_name) {
        var att = template.attributes[att_name]
        if (att.shown) atts.push(att)
      }
    )
  }
  return atts
}

var Browser = connect(
  function (state,props) {
    var template_record = state.templates[props.model_name]
    var template = template_record ? template_record.template : null
    var patched_template = template_record ? template_record.patched_template : null
    var document = template_record ? template_record.documents[props.record_name] : null
    var revision = template_record ? template_record.revisions[props.record_name] : null
    return $.extend(
      {},
      props,
      {
        template: template,
        document: document,
        skin_name: template ? template.name.toLowerCase() : "",
        revision: revision || {},
        attributes: filterAttributes(template),
        patched_attributes: filterAttributes(patched_template)
      }
    );
  },
  function (dispatch,props) {
    return {
      request: function(success) {
        dispatch(magmaActions.requestTemplateAndDocuments(
          props.model_name,
          [ props.record_name ], 
          success))
      },
      discardRevision: function() {
        dispatch(magmaActions.discardRevision(
          props.record_name,
          props.model_name
        ))
      },
      showMessage: function(messages) {
        dispatch(messageActions.showMessages(
          messages))
      }
    }
  }
)(BrowserDisplay);

Browser.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Browser;
