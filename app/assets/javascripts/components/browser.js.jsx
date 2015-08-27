Browser = React.createClass({
  componentDidMount: function() {
    var self = this;

    $.get( Routes.browse_json_path(this.props.model, encodeURIComponent(this.props.record)), function(result) {
      self.data_update(result);
      $(React.findDOMNode(self)).submit(self.update_form);
    });
  },
  getInitialState: function() {
    return { mode: 'loading', editable: null }
  },
  submit_edit: function() {
    $(React.findDOMNode(this)).submit();
  },
  update_form: function() {
    var node = $(React.findDOMNode(this));
    var submission = new FormData(node[0])
    // we need to fix some entries in our submission.
    this.update_form_tokens(submission);
    console.log("Posting via AJAX");
    console.log(submission);
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
    result = result.responseJSON;
    this.handle_mode( 'edit' );
    console.log("Got an error");
    console.log(result);
    if (result && result.errors)
      this.props.show_errors(result.errors);
    else
      this.props.show_errors([ "An unknown error occurred." ]);
  },
  data_update:  function(result) {
    this.handle_mode( 'browse', { record: result.record, model: result.model, editable: result.editable } );
  },
  update_form_tokens: function(submission) {
    for (var key in this.form_tokens) {
      var token = this.form_tokens[key];
      if (token.constructor == Object)
        token = Object.keys(token).filter(function(k) {
          return token[k];
        });
      submission.append(key, token);
    }
  },
  handle_mode: function(mode,opts) {
    var self = this;
    var handler = {
      submit: function() {
        self.submit_edit();
      },
      browse: function() {
        self.form_tokens = {};
        self.props.show_errors([]);
      }
    }
    if (handler[mode]) handler[mode]();
    this.setState( $.extend({ mode: mode }, opts) );
  },
  get_data: function(data) {
    $.get(this.props.source, data, this.data_update);
  },
  process: function( job, item ) {
    // general workhorse function that handles stuff from the components
    console.log(item);
    switch(job) {
      case 'form-token-update':
        if (!this.form_tokens) this.form_tokens = {};
        if (item.value == null)
          delete this.form_tokens[ item.name ];
        else if (item.value.constructor == Object)
          this.form_tokens[ item.name ] = $.extend(this.form_tokens[ item.name ], item.value);
        else
          this.form_tokens[ item.name ] = item.value;
        break;
      case 'request-extension':
        this.get_data( { extensions: [ item ] } );
    };
  },
  skin: function() {
    if (this.state.mode == "browse") {
      var set = this.state.model.skin || [];
      return set.concat(['model_viewer']).join(' ');
    } else
      return 'model_viewer';
  },
  render: function() {
    var token = $( 'meta[name="csrf-token"]' ).attr('content');
    if (this.state.mode == 'loading')
      return <div className={ this.skin() }/>;
    else {
      return <form className={ this.skin() } method="post" model={ this.state.model } record={ this.state.record } action={ Routes.update_model_path() } encType="multipart/form-data">
        <input type="hidden" name="authenticity_token" value={ token }/>
        <input type="hidden" name="model" value={ this.state.model.name }/>
        <input type="hidden" name="record_id" value={ this.state.record.id }/>
        <BrowserHeader mode={ this.state.mode } model={ this.state.model } mode_handler={ this.handle_mode } editable={ this.state.editable } />
        <Attributes mode={ this.state.mode } model={ this.state.model } record={ this.state.record } process={ this.process }/>
      </form>
    }
  }
});
