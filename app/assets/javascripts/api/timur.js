import { headers, generateDownload, parseJSON, makeBlob, checkStatus } from './fetch_utils'

export const getTSV = (model_name, record_names, exchange) =>
  exchange.fetch(
    Routes.table_tsv_path(), 
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers('json', 'csrf'),
      body: JSON.stringify({
        model_name: model_name,
        record_names: record_names
      })
    }
  )
    .then(checkStatus)
    .then(makeBlob)
    .then(
      generateDownload(`${model_name}.tsv`)
    )

export const getView = (model_name, tab_name, exchange) =>
  exchange.fetch(
    Routes.view_json_path(),
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers('json', 'csrf'),
      body: JSON.stringify({
        model_name: model_name,
        tab_name: tab_name
      })
    }
  )
    .then(checkStatus)
    .then(parseJSON)

export const getDocuments = (model_name, record_names, attribute_names, collapse_tables, exchange) =>
  exchange.fetch(
    Routes.records_json_path(),
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers('json', 'csrf'),
      body: JSON.stringify({
        model_name: model_name,
        record_names: record_names,
        attribute_names: attribute_names,
        ...collapse_tables && { collapse_tables: true }
      })
    }
  )
    .then(checkStatus)
    .then(parseJSON)

export const postRevisions = (revision_data, exchange) =>
  exchange.fetch(
    Routes.update_model_path(),
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers('csrf'),
      body: revision_data
    }
  )
    .then(checkStatus)
    .then(parseJSON)


export const getConsignments = (manifests, exchange) =>
  exchange.fetch(
    Routes.query_json_path(),
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers('json', 'csrf'),
      body: JSON.stringify({queries: manifests})
    }
  )
    .then(checkStatus)
    .then(parseJSON)
