require 'csv'

class SearchController <  ApplicationController
  include ActionController::Live
  before_filter :authenticate
  before_filter :readable_check
  layout 'timur'

  def index
    @project_name = params[:project_name]
  end

  def table_json
    begin
      response = Magma::Client.instance.query(
        token, params[:project_name],
        [ params[:model_name], "::all", "::identifier" ]
      )
      ids = JSON.parse(payload)
      render(json: { record_names: ids['answer'].map(&:last) })
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    end
  end

  def table_tsv
    begin
      filename = "#{params[:model_name]}.tsv"
      response.headers['Content-Type'] = 'text/tsv'
      response.headers['Content-Disposition'] = %Q( attachment; filename="#{filename}" )

      Magma::Client.instance.retrieve(
        token,
        params[:project_name],
        model_name: params[:model_name],
        record_names: params[:record_names],
        attribute_names: 'all',
        filter: params[:filter],
        format: 'tsv'
      ) do |magma_response |
        magma_response.read_body do |chunk|
          response.stream.write(chunk)
        end
        response.stream.close
      end
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    end
  end

  def records_json
    begin
      magma = Magma::Client.instance
      response = magma.retrieve(
        token, params[:project_name],
        params
      )
      render json: response.body
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    end
  end

  def question_json
    begin
      magma = Magma::Client.instance
      response = magma.query(
        token, params[:project_name],
        params[:question]
      )
      render json: response.body
    rescue Magma::ClientError => e
      render(json: e.body, status: e.status)
    end
  end

  def consignment_json
    render(fetch_consignments(params[:queries]))
  end

  def consignment_by_manifest_id_json

    # Pull the manifests by their ids.
    manifests = params[:manifest_ids].map do |manifest_id|
      manifest = Manifest.find_by_id(manifest_id)

      # Append the record name to the manifest as it needs it for processing.
      manifest_elements = [
        ['record_name', "'#{params[:record_name]}'"]
      ]

      # Translate the manifests into a form usable by DataManifest.
      manifest[:data]['elements'].each do |manifest_element|
        manifest_elements.push([
          manifest_element['name'],
          manifest_element['script']
        ])
      end

      {
        id: manifest[:id],
        name: manifest[:name],
        manifest_elements: manifest_elements
      }
    end

    # We return the consignments with the manifest ids as the key.
    render(fetch_consignments(manifests))
  end

  private

  def fetch_consignments(queries)
    begin
      consignment = Hash[
        queries.map do |query|
          [
            query[:id],
            Archimedes::Manifest.create(
              token,
              params[:project_name],
              query[:manifest_elements]
            ).payload
          ]
        end
      ]
      return {json: consignment}
    rescue Magma::ClientError => e
      return {json: e.body, status: e.status}
    rescue Archimedes::LanguageError => e
      return {json: { errors: [e.message] }, status: 422}
    end
  end
end
