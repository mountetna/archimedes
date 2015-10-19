class ScatterPlotJson
  include PlotHelper
  include PopulationHelper

  class << self
    def template
      {
        name: "XY Scatter",
        type: "Scatter",
        indications: [ "Any" ] + Experiment.select_map(:name),
        colors: {
          red: '#ff0000',
          blue: '#0000ff',
          green: '#00ff00'
        },
        stains: [ :treg, :nktb, :sort, :dc ],
        populations: get_population_names_by_stain,
        mfis: get_mfi_by_populations,
        clinicals: get_clinical_names_by_indication
      }
    end

    private
    def get_population_names_by_stain
      Population.distinct(:stain, :ancestry, :name).select_hash_groups(:stain, [ :name, :ancestry ]).map do |stain,pops|
        { 
          stain => pops.map do |name,ancestry|
            {
              name: name,
              ancestry: ancestry
            }
          end.sort_by do |pop|
            pop[:name]
          end
        }
      end.reduce :merge
    end

    def get_clinical_names_by_indication
      Clinical.order
        .join(:patients, clinical_id: :id)
        .join(:experiments, experiments__id: :patients__experiment_id)
        .join(:parameters, clinical_id: :clinicals__id)
        .distinct(:experiments__name, :parameters__name, :parameters__value)
        .select_hash_groups(:experiments__name___experiments_name,
          [:parameters__name___parameters_name, :parameters__value]).map do |exp, params|
          {
            exp => params.group_by(&:first).map do |name, array|
              { name => array.map(&:last) }
            end.reduce(:merge)
          }
      end.reduce :merge
    end
  end

  VARIABLES = [
    "CD4-CD8-/CD3 all" ,
    "CD14+ TAM/CD45+",
    "BDCA3+/HLADR+",
    "CD4+CD8+/CD3 all",
    "Tr/Th"
  ]

  def initialize params
    @x_var = params[:x_mapping].merge( op: :/ )
    @y_var = params[:y_mapping].merge( op: :/ )
    @indication = Experiment[name: params[:series][:indication] ]
  end

  def to_json
    # you should return an array of objects with name, x/y pairs, and colors
    {
      plot: {
          name: 'scatter',
          width: 800,
          height: 300,
          margin: { top: 30, right: 150, bottom: 30, left: 150},
      },
      xlabel: label_for(@x_var),
      ylabel: label_for(@y_var),
      data: x_y_data
    }
  end

  private 

  def get_relation var, sample_id
    compute_operation(var[:op], var[:v1], var[:v2], discard_null: true) do |name|
      sample_count(populations, sample_id, var[:stain].to_sym, name)
    end
  end

  def label_for var
    "#{var[:stain]} #{var[:v1].sub(/##.*/,'')} #{var[:op]} #{var[:v2].sub(/##.*/,'')}"
  end

  def x_y_data
    sample_id_hash.map do |sample_id, sample_name|
      value = {
        name: sample_name,
        x: get_relation( @x_var, sample_id ),
        y: get_relation( @y_var, sample_id )
      }
      value if value[:x] && value[:y]
    end.compact
  end
end
