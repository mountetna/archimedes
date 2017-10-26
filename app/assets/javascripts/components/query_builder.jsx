import { Component } from 'react';
import { requestPredicates, requestModels } from '../actions/magma_actions';
import Magma from '../magma';
import { Animate } from 'react-move';
import PredicateChainSet from './query_builder/predicate_chain_set';

const predicateArray = (predicate) => {
  let { type, filters, model_name, args, start } = predicate;
  switch(type) {
    case 'model':
      let ary = [];
      if (start) ary.push(model_name);
      if (filters.length) ary = ary.concat( filters.map(chainArray) )
      return ary.concat(args);
    case 'terminal':
      return [];
    case 'record':
      if (Array.isArray(args[0])) return [ args[0].map(chainArray) ];
      // let this continue through to default
    default:
      return args.filter(x=>x!=null);
  }
}

const chainArray = (chain) => chain.map(predicateArray).reduce(
  (predArray,pred) => predArray.concat(pred),
  []
);

const predicateComplete = (predicate) => predicate.completed || predicate.type == 'terminal';

const formatChainArray = (terms) => {
  return `[ ${
    terms.map(term => {
      if (typeof(term) == 'string') return `'${term}'`;
      if (Array.isArray(term)) return formatChainArray(term);
      return term;
    }).join(', ')
    } ]`;
}

const defaultQuery = () => (
  [
    [
      // initially there is an empty model_list predicate
      {
        type: 'model',
        start: true
      }
    ]
  ]
);

class QueryBuilder extends Component {
  constructor() {
    super()
    this.state = { 
      shown: false
    }
  }

  updateQuery(query) {
    this.setState({ query });
  }

  componentDidMount() {
    this.props.requestModels();
    this.props.requestPredicates();
  }

  renderQuery() {
    let { query } = this.state;
    let predicates = query[0];

    if (!predicates.every(predicateComplete)) return <div className='query'/>;

    let queryArray = chainArray(predicates);
    let queryString = formatChainArray(queryArray);

    return <div className='query'>
      { queryString }
    </div>
  }

  toggleShown() {
    let { shown, query } = this.state;
    shown = !shown;

    if (shown) query = defaultQuery();
    else query = null;
    this.setState({ shown, query });
  }

  render() {
    let { query, shown } = this.state;
    console.log(query);
    return <div id='query'>
      <div className='visibility'>
        <button onClick={ this.toggleShown.bind(this) }>
          { shown ? 'Hide Query' : 'Build Query' }
        </button>
      </div>
      {
        shown && <PredicateChainSet chains={ query } update={ this.updateQuery.bind(this) } />
      }
      {
        shown && this.renderQuery()
      }
    </div>
  }
}

export default connect(
  null,
  {
    requestModels,
    requestPredicates
  }
)(QueryBuilder)
