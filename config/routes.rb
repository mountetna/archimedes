Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  root 'welcome#index'

  get 'static/:path' => 'welcome#static', as: :static
  get 'login' => 'welcome#login', as: :login
  get 'noauth' => 'welcome#noauth', as: :noauth

  match 'auth/shibboleth/callback' => 'welcome#auth', via: [ :get, :post ], as: :auth
  get 'auth/shibboleth' => 'welcome#auth', as: :auth_shib

  # Routes for the main views - just browse for now
  #
  get 'browse' => 'browse#index', as: :browse

  get 'browse/:model/:name' => 'browse#model', as: :browse_model, constraints: { name: /[^\/]+/ }
  post 'json/template/' => 'browse#json', as: :template_json
  post 'browse/update' => 'browse#update', as: :update_model

  get 'plot' => 'plot#index', as: :plot
  get 'json/plot_types' => 'plot#plot_types_json', as: :plot_types_json
  post 'json/plot' => 'plot#plot_json', as: :plot_json
  post 'json/pythia' => 'plot#pythia_json', as: :pythia_json
  post 'update_saves' => 'plot#update_saves', as: :update_saves

  get 'search' => 'search#index', as: :search
  get 'json/search' => 'search#json', as: :search_json
  post 'json/table' => 'search#table_json', as: :table_json
end
