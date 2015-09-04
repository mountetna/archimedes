(function() {

d3.scatter = function() {
  var width = 1,
      height = 1,
      xlabel = null,
      ylabel = null,
      xdomain = null,
      ydomain = null,
      tickFormat = null;

  function scatter(g) {
    // Compute the new x-scale.
    var xScale = d3.scale.linear()
          .domain(xdomain())
          .range([0, width]),

        yScale = d3.scale.linear()
          .domain(ydomain())
          .range([height, 0]),

        xAxis = d3.svg.axis()
          .scale(xScale)
          .tickSize(5)
          .ticks(5)
          .orient('bottom')
          .tickSubdivide(true),

        yAxis = d3.svg.axis()
          .scale(yScale)
          .tickSize(5)
          .ticks(5)
          .orient('left')
          .tickSubdivide(true);

    var yElement = g.append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    g.append('text')
      .attr('class', 'y axis label')
      .attr("text-anchor", "middle")
      .attr('transform', ' translate(-50 ,'+height/2+') rotate(-90)')
      .text(ylabel)

    g.append('text')
      .attr('class', 'x axis label')
      .attr('y', height + 40)
      .attr('x', width/2)
      .attr("text-anchor", "middle")
      .text(xlabel)

    var xElement = g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,'+height+')')
      .call(xAxis);

    var tooltip = g.append("text")
      .attr("class", "tooltip")
      .attr("text-anchor", "start")
      .attr("visibility", "hidden")

    g.selectAll("circle.dot")
      .data(g.data()[0])
      .enter()
      .append("circle")
        .attr("class","dot")
        .attr("r", 2.5)
        .attr("cx", function(d) { return xScale(d.x) })
        .attr("cy", function(d) { return yScale(d.y) })
      .on("click", function(d) {
        window.location = Routes.browse_model_path('sample', d.name);
      })
      .on("mouseover", function(d) {
        tooltip.node().parentNode.appendChild(tooltip.node());
        tooltip.attr("visibility", "visible")
          .text(d.name)
          .attr("transform", 'translate( ' + (xScale(d.x) + 10) + ',' + yScale(d.y) + ')')
      })
      .on("mouseout", function(d) {
        tooltip.attr("visibility", "hidden")
      })
    }

  scatter.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return scatter;
  };

  scatter.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return scatter;
  };

  scatter.xlabel = function(x) {
    if (!arguments.length) return xlabel;
    xlabel = x;
    return scatter;
  };

  scatter.ylabel = function(x) {
    if (!arguments.length) return ylabel;
    ylabel = x;
    return scatter;
  };

  scatter.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return scatter;
  };

  scatter.xdomain = function(x) {
    if (!arguments.length) return xdomain;
    xdomain = x == null ? x : d3.functor(x);
    return scatter;
  };

  scatter.ydomain = function(x) {
    if (!arguments.length) return ydomain;
    ydomain = x == null ? x : d3.functor(x);
    return scatter;
  };

  return scatter;
};

})();
