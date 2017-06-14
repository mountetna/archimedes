class DataTable
  attr_reader :row_names, :col_names, :rows

  def initialize row_names, col_names, rows, col_types
    @row_names = row_names
    @col_names = col_names
    @rows = rows
    @col_types = col_types
    @columns = {}
  end

  def [] column_name
    return column(column_name)
  end

  def payload
    to_matrix
  end

  def to_matrix
    {
      # you need to name your samples
      matrix: {
        col_names: @col_names,
        row_names: @row_names,
        rows: @rows.map(&:to_values),
        col_types: @col_types,
      }
    }
  end

  def column column_name
    return @columns[column_name] if @columns[column_name]

    @columns[column_name] = Vector.new(
      @row_names.zip(
        case column_name
        when "row_name"
          @row_names
        when "row_number"
          (0...@rows.size).to_a
        else
          @rows.map do |row|
            row[column_name]
          end
        end
      )
    )
  end

  private

end
