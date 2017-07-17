class Matrix {
  constructor() {
    if (arguments.length == 3) {
      this.rows = arguments[0]
      this.row_names = arguments[1]
      this.col_names = arguments[2]
    } else {
      this.rows = arguments[0].rows
      this.row_names = arguments[0].row_names
      this.col_names = arguments[0].col_names
    }

    this.num_rows = this.rows.length

    if (this.col_names) {
      this.num_cols = this.col_names.length
      if (this.col_names.length != this.num_cols) throw "col_names size is different from num_cols"
    } else if (this.rows[0]) {
      this.num_cols = this.rows[0].length
      this.col_names = this.rows[0].map((_,i)=>`C${i}`)
    }
    if (this.row_names) {
      if (this.row_names.length != this.num_rows) throw "row_names size is different from num_rows"
    } else {
      this.row_names = this.rows.map((_,i)=>`R${i}`)
    }
  }
  
  row(i) {
      return this.rows[i]
  }

  col(j) {
    return this.rows.map((row) => row[j])
  }

  index(dim,name) {
    if (dim == 'row' && this.row_names) return this.row_names.indexOf(name)
    if (dim == 'col' && this.col_names) return this.col_names.indexOf(name)
  }

  map(dim,callback) {
    if (dim == 'row') {
      return this.rows.map(
        (_, i) => callback(this.row(i), i, this.row_names[i])
      )
    }
    if (dim == 'col') {
      return this.rows[0].map(
        (_, j) => callback(this.col(j), j, this.col_names[j])
      )
    }
  }
  filter(dim, callback) {
    if (dim == 'row') {
      var new_rows = []
      var new_names = []
      this.rows.forEach((row,i) => {
        if (callback(row,i,this.row_names[i])) {
            new_rows.push(row)
            new_names.push(this.row_names[i])
        }        
      })
      return new Matrix(new_rows,new_names,this.col_names)
    }
    if (dim == 'col') {
      var selected_cols = []
      var new_colnames = []
      
      for (var j = 0; j < this.num_cols; j++) {
        var col = this.col(j)
        if (callback(col, j, this.col_names[j])) {
            selected_cols.push(col)
            new_colnames.push(this.col_names[j])
        }
      }
      // make a new matrix using selected_cols
      var col_matrix = new Matrix(selected_cols,new_colnames,this.row_names)
      return col_matrix.transpose()
    }
  }

  sort(dim,callback) {
    // return a new matrix with rows sorted by comparison criterion
    if (dim == 'row') {
      var row_sorter = this.rows.map((row,index) => ({ row, index }))
        .sort((a, b) => callback(a.row, this.row_names[a.index], b.row, this.row_names[b.index]))

      var new_rows = row_sorter.map((sorter) => this.rows[sorter.index])
      var new_names = row_sorter.map((sorter) => this.row_names[sorter.index])
      return new Matrix(new_rows,new_names,this.col_names)
    }
    if (dim == 'col') {
      var col_sorter = this.rows[0].map((_,index) => ({ index, col: this.col(i) }))
        .sort((a, b) => callback(a.col, this.col_names[a.index] , b.col, this.col_names[b.index]))

      var new_cols = col_sorter.map((sorter) => sorter.col)
      var new_names = col_sorter.map((sorter) => this.col_names[sorter.index])
      var col_matrix = new Matrix(new_cols,new_names,this.row_names);
      return col_matrix.transpose()
    }
  }

  transpose() {
    return new Matrix(
      this.rows[0].map(
        (_, c) => this.rows.map((r) => r[c] ) 
      ),
      this.col_names, this.row_names
    )
  }
}

export default Matrix
