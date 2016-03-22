Timur = React.createClass({
  create_store: function() {
    return Redux.applyMiddleware(thunk)(Redux.createStore)(Redux.combineReducers({
      timur: timurReducer,
      messages: messageReducer,
      plots: plotReducer
    }))
  },
  render: function () {
    return <Provider store={ this.create_store() }>
          <TimurApp
            user={ this.props.user }
            mode={ this.props.mode }
            model={ this.props.model }
            record={ this.props.record }
            environment={ this.props.environment } />
    </Provider>;
  }
});

TimurApp = React.createClass({
  render: function() {
    var component;
    if (this.props.mode == 'browser') 
      component = <Browser model={ this.props.model } record={ this.props.record } />;
    else if (this.props.mode == 'plotter')
      component = <Plotter />;
    else if (this.props.mode == 'search')
      component = <Search />;

    return <div>
              <TimurNav user={ this.props.user } environment={ this.props.environment}/>
              <Messages/>
              { component }
           </div>;
  }
});

TimurNavBar = React.createClass({
  render: function() {
    var self = this;
    var browse_path = Routes.browse_path();
    var search_path = Routes.search_path();
    var plot_path = Routes.plot_path();
    var login_path = Routes.login_path();

    var login;
    var heading;
    var logo_id;

    login = this.props.user || <a href={ login_path}>Login</a>;
    if (this.props.environment == 'development') {
      heading = <span>Timur Development</span>;
      logo_id = "devlogo"
    }
    else {
      heading = <span>Timur <b>:</b> Data Browser</span>;
      logo_id = "logo"
    }
    return <div id="header">
             <a href="/">
               <div id={ logo_id }> &nbsp; 
               </div>
             </a>
             <div id="help_float">
                 <Help info={ [ 
                   ">...Who, from a Scythian Shephearde  \n"+
                   ">by his rare and woonderfull Conquests, became a most  \n"+
                   ">puissant and mightye Monarque.  And (for his tyranny,  \n"+
                   ">and terrour in Warre) was tearmed, The Scourge of God.  \n  \n"+
                   "&mdash; Tamburlaine the Great, by Christopher Marlowe",

                   "![Alliteration and Variation in Old Germanic Name-Giving](names.png)  \n"+
                   "&mdash; George T. Flom, _Modern Language Notes_ Vol. 32, No. 1 (Jan., 1917), pp. 7-17 "
                 ] }/>
              </div>
             <div id="heading">
             { heading }
             </div>
             <div id="nav">
               <div className="nav_tab">
                 <a href={ browse_path }> Browse </a>
               </div>
               <div className="nav_tab">
                 <a href={ search_path }> Search </a>
               </div>
               <div className="nav_tab">
                 <a href={ plot_path }> Plot </a>
               </div>
               <div className="nav_tab">
                 <a onClick={ 
                   function(e) {
                     self.props.dispatch(timurActions.toggleConfig('help_shown'))
                   }
                 }>
                 {
                   this.props.helpShown ? 'Hide Help' : 'Help'
                 }
                 </a>
               </div>
               <div id="login">
                 { login }
               </div>
             </div>
           </div>;
  }
});

TimurNav = connect(
  function (state) {
    return {
      helpShown: state.timur.help_shown
    }
  }
)(TimurNavBar);

TimurNav.contextTypes = {
  store: React.PropTypes.object
};

module.exports = Timur;
