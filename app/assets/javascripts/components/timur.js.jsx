import createLogger from 'redux-logger'
import rootReducer from '../reducers'

var Timur = React.createClass({
  create_store: function() {
    let middleWares = [thunk]
    if (process.env.NODE_ENV != "production") {
      middleWares.push(createLogger())
    }
    return Redux.applyMiddleware(...middleWares)(Redux.createStore)(rootReducer)
  },
  render: function () {
    var component
    if (this.props.mode == 'browse') 
      component = <Browser 
        can_edit={ this.props.can_edit }
        model_name={ this.props.model_name }
        record_name={ this.props.record_name } />
    else if (this.props.mode == 'plot')
      component = <Plotter />
    else if (this.props.mode == 'search')
      component = <Search can_edit={ this.props.can_edit }/>
    else if (this.props.mode == 'activity')
      component = <Activity activities={ this.props.activities }/>
    else if (this.props.mode == 'noauth')
      component = <Noauth user={ this.props.user }/>

    var store = this.create_store()
    window.store = store

    return <Provider store={ store }>
            <div>
              <TimurNav user={ this.props.user }
                can_edit={ this.props.can_edit }
                mode={ this.props.mode }
                environment={this.props.environment}/>
              <Messages/>
              { component }
           </div>
    </Provider>
  }
})

module.exports = Timur
