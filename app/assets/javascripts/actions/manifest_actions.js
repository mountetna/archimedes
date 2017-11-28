// Module imports.
import {showMessages} from './message_actions';
import {addPlot} from './plot_actions';
import {Exchange} from './exchange_actions';
import * as ManifestAPI from '../api/manifests';

// Add retrieved manifests to the store.
const loadManifests = (manifestsById)=>({
  'type': 'LOAD_MANIFESTS',
  manifestsById
});

// Remove a manifest from the store.
const removeManifest = (id)=>({
  'type': 'REMOVE_MANIFEST',
  id
});

// Add a manifest to the store.
const addManifest = (manifest)=>({
  'type': 'ADD_MANIFEST',
  manifest
});

const editManifest = (manifest) =>({
  'type': 'UPDATE_USER_MANIFEST',
  manifest
});

// Manifest ui editing flag.
export const toggleEdit = ()=>({
  'type': 'TOGGLE_IS_EDITING_MANIFEST'
});

export const toggleManifestsFilter = (filter)=>({
  'type': 'TOGGLE_MANIFESTS_FILTER',
  filter
});

export const selectManifest = (id)=>({
  'type': 'SELECT_MANIFEST',
  id
});

export const addConsignment = (id, consignment)=>{
  return {
    type: 'ADD_CONSIGNMENT',
    manifest_id: id,
    consignment: consignment
  };
};

// Retrieve all user-visible manifests and send to store.
export const requestManifests = ()=>{
  return (dispatch)=>{

    let localSuccess = ({manifests})=>{

      // Bail out if there are no manifests.
      if (manifests == null) return;

      // Transform manifests for store.
      let manifests_by_id = manifests.reduce((acc, manifestJSON)=>{
        let manifest = {...manifestJSON};
        delete manifest.plots;
        return {...acc, [manifestJSON.id]: manifest};
      }, {});

      dispatch(loadManifests(manifests_by_id));

      // Collect all the plots from the manifests.
      let plots = manifests.reduce((all_plots, manifestJSON)=>{
        return [...all_plots, ...manifestJSON.plots];
      }, []);

      // Add the plots to the store.
      plots.forEach(plot => dispatch(addPlot(plot)));
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return ManifestAPI.fetchManifests(new Exchange(dispatch,'request-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

// Delete a manifest from the database and the store.
export const deleteManifest = (manifest_id)=>{
  return (dispatch)=>{

    let localSuccess = (data)=>{
      dispatch(selectManifest(null));
      dispatch(removeManifest(manifest_id));
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

   return ManifestAPI.destroyManifest(manifest_id, new Exchange(dispatch, 'delete-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

// Post to create new manifest and save in the store.
export const saveNewManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(addManifest(response.manifest));
      dispatch(toggleEdit());
      dispatch(selectManifest(response.manifest.id));
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return ManifestAPI.createManifest(manifest, new Exchange(dispatch, 'save-new-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

export const saveManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (data)=>{
      dispatch(editManifest(manifest));
      dispatch(toggleEdit());
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return ManifestAPI.updateManifest(manifest, manifest.id, new Exchange(dispatch, 'save-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

export const copyManifest = (manifest)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      dispatch(addManifest(response.manifest));
      dispatch(selectManifest(response.manifest.id));
      dispatch(toggleEdit());
    };

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    return ManifestAPI.createManifest({...manifest, 'name': `${manifest.name}(copy)`}, new Exchange(dispatch, 'copy-manifest'))
      .then(localSuccess)
      .catch(localError);
  };
};

/*
 * Post a manifest to the query api and send the returned consignment to the
 * store. If things go wrong, show a message with the error.
 */
export const requestConsignments = (manifests, success, error)=>{

  return (dispatch)=>{
    var localSuccess = (response)=>{
      for(var id in response){
        dispatch(addConsignment(id, response[id]));
      }

      if(success != undefined) success(response);
    };

    var localErrorResponse = (response)=>{

      if(response.query){

        var msg = `### For our inquiry:\n\n`;
        msg +=    `\`${JSON.stringify(response.query)}\`\n\n`;
        msg +=    `## this bitter response:\n\n`;
        msg +=    `    ${response.errors}`;
        dispatch(showMessages([msg]));
      }
      else if(response.errors && response.errors.length == 1){

        var msg = `### Our inquest has failed, for this fault:\n\n`;
        msg +=    `    ${response.errors[0]}`;
        dispatch(showMessages([msg]));
      }
      else if(response.errors && response.errors.length > 1){

        var msg = `### Our inquest has failed, for these faults:\n\n`;
        msg +=    `${response.errors.map((error) => `* ${error}`).join('\n')}`;
        dispatch(showMessages([msg]));
      }

      if(error != undefined) error(response);
    };

    var localError = (e) => e.response.json().then(localErrorResponse);
    var exchng = new Exchange(dispatch, 'consignment list');

    ManifestAPI.getConsignments(manifests, exchng)
      .then(localSuccess)
      .catch(localError);
  };
};

export const requestConsignmentsByManifestId = (manifest_ids, record_name)=>{

  return (dispatch)=>{

    let localSuccess = (response)=>{
      for(let id in response) dispatch(addConsignment(id, response[id]));
    };

    let localError = (response)=>{
      console.log(response);
    };

    let exchng = new Exchange(dispatch, 'consignment list');

    ManifestAPI.getConsignmentsByManifestId(manifest_ids, record_name, exchng)
      .then(localSuccess)
      .catch(localError);
  }
};


// Convert a manifest to its JSON representation for query endpoint.
export const manifestToReqPayload = (manifest)=>{
  let {id, name, 'data': {elements}} = manifest;
  let manifest_elements = elements.reduce((acc, {name, script})=>{
    if(name !== '' && script !== ''){
      return [...acc, [name, script]];
    }
    return acc;
  }, []);

  return {id, name, manifest_elements};
};

const showErrors = (e, dispatch)=>{
  let localError = (json)=>dispatch(showMessages(json.errors));
  e.response.json()
    .then(localError);
};
