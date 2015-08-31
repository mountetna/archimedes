(function() {
// Inspired by http://informationandvisualization.de/blog/bar-plot
d3.bar = function() {
  var width = 1,
      height = 1,
      duration = 0,
      domain = null,
      value = Number,
      whiskers = barWhiskers,
      quartiles = barQuartiles,
      tickFormat = null;

  // For each small multiple…
  function bar(g) {
    // Compute the new x-scale.
    var yScale = d3.scale.linear()
          .domain(domain())
          .range([height, 0]),
        yAxis = d3.svg.axis()
          .scale(yScale)
          .tickSize(5)
          .ticks(5)
          .orient('left')
          .tickSubdivide(true);

    var zoom = d3.behavior.zoom()
      .scaleExtent([0,1])
      .on("zoom",function() {
        console.log("Zooming");
        yScale.domain([ 0, domain()[1] * Math.pow(d3.event.scale,0.5)]);
        yElement.call(yAxis);
        //draw();
      })
      .on("zoomend",function() {
        draw();
      });

    var yElement = g.append('g')
      .attr('class', 'y axis')
      .call(yAxis)

    g.call(zoom);

    var rect = g.append("rect")
          .attr("width", 50*width)
          .attr("height", height)
          .style("fill", "none")
          .style("pointer-events", "all");

    draw();

    function draw() {
        g.selectAll("g.bar").remove()

        g.selectAll("g.bar")
          .data(g.data()[0])
          .enter()
          .append("g")
          .attr("class", "bar")
          .each(function(data, i) {
          var g = d3.select(this);

          // Note: the bar, median, and bar tick elements are fixed in number,
          // so we only have to handle enter and update. In contrast, the outliers
          // and other elements are variable, so we need to exit them! Variable
          // elements also fade in and out.
          var bar = g.selectAll("rect.bar").data([data]);

          bar.enter().append("rect")
              .attr("class", "bar")
              .attr("x", 10 + i * 30)
              .attr("y", function(d) { return yScale(d.height) - yScale(yScale.domain()[1]) })
              .attr("width", width)
              .attr("style", function(d) { return "stroke:"+(d.color || "white") })
              .attr("height", function(d) { return yScale(0) - yScale(d.height); })

          bar.attr("y", function(d) { return yScale(d.height) - yScale(yScale.domain()[1]) })
             .attr("height", function(d) { return yScale(0) - yScale(d.height); });

          if (data.dots) {
            var dots = g.selectAll("circle.dot")
              .data(data.dots)

            dots.enter().append("circle")
              .attr("class","dot")
              .attr("r", 1.5)
              .attr("cx", function(d) { return 10 + i * 30 + ((1000*d)%8)-4 + width/2; })
              .attr("cy", function(d) { return yScale(d); })
          }

          var text = g.selectAll("text.bar")
            .data([data])

          text.enter().append("text")
            .attr("class", "bar")
            .attr("text-anchor", "start")
            .text(function(d) { return d.series })
            .attr("transform", 'translate('+(10 + i * 30)+','+(yScale(yScale.domain()[0]) + 15)+') rotate(45)');
      });
    }
  }

  bar.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return bar;
  };

  bar.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return bar;
  };

  bar.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return bar;
  };

  bar.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return bar;
  };

  bar.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x == null ? x : d3.functor(x);
    return bar;
  };

  bar.value = function(x) {
    if (!arguments.length) return value;
    value = x;
    return bar;
  };

  return bar;
};

function barWhiskers(d) {
  return [0, d.length - 1];
}

function barQuartiles(d) {
  return [
    d3.quantile(d, .25),
    d3.quantile(d, .5),
    d3.quantile(d, .75)
  ];
}

})();
