require 'net/http'
require 'uri'
require 'json'
require 'mime/types'

class BrowseController <  ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  before_filter :editable_check, only: :update
  layout "timur"

  def index
    redirect_to browse_model_path(:project, "UCSF Immunoprofiler")
  end

  def model
    # Get the model name
    @model_name = params[:model]
    @record_name = params[:name]
  end

  def map
  end

  def activity
    @activities = Activity.order(created_at: :desc).limit(50).map do |activity|
      {
        date: activity.created_at,
        user: activity.user.name,
        model_name: activity.magma_model,
        record_name: activity.identifier,
        action: activity.action
      }
    end
  end

  def view_json
    # Get the model name

    view = TimurView.create(
      params[:model_name],
      params[:tab_name] ? params[:tab_name].to_sym : nil
    )

    render json: view
  end

  def update
    begin
      status, payload = Magma::Client.instance.update(
        params[:revisions]
      )
      render json: payload
    rescue Magma::ClientError => e
      render json: e.body, status: e.status
    end
  end
end
