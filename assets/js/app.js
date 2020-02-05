// Create plot orientation setup
var svgWidth = 1100;
var svgHeight = 550;
var margin = {top: 20, right: 20, bottom: 50, left: 400};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG WRAPPER, append it to a group and adjust margins
var svg = d3.select("body")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append the SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

// Import the POVERTY and HEALTHCARE data and format numbers to integers
d3.csv("data.csv", function(error, healthData) {
  if (error) throw error;
console.log(healthData)

healthData.forEach(function(data) {
  data.poverty = +data.poverty;
  data.healthcare = +data.healthcare;
});

// Define the scale for x and y axis
var xLinearScale = d3.scaleLinear().range([0, width]);
var yLinearScale = d3.scaleLinear().range([height, 0]);

// Define the DATA functions for x and y axis
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

var xMin = d3.min(healthData, function(data) {
  return data.healthcare *.9;
});
var xMax =  d3.max(healthData, function(data) {
  return data.healthcare *1.1;
});
var yMin = d3.min(healthData, function(data) {
  return data.poverty *.9;
});
var yMax = d3.max(healthData, function(data) {
  return data.poverty *1.1;
});

xLinearScale.domain([xMin, xMax]);
yLinearScale.domain([yMin, yMax]);
console.log(xMin);
console.log(xMax);
console.log(yMin);
console.log(yMax);

// Append x and y axis to the plot
chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);
chartGroup.append("g")
  .call(leftAxis);

// Draw the circles for the bubble plot
var circlesGroup = chartGroup.selectAll("circle")
  .data(healthData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.healthcare +1.5))
  .attr("cy", d => yLinearScale(d.poverty +0.3))
  .attr("r", "16")
  .attr("fill", "dodgerblue")
  .attr("opacity", .5)
  
// Additional formatting and create the labels for the x and y axis
chartGroup.append("text")
  .style("font-size", "12px")
  .selectAll("tspan")
  .data(healthData)
  .enter()
  .append("tspan")
    .attr("x", function(data) {
      return xLinearScale(data.healthcare +1.28);
    })
    .attr("y", function(data) {
      return yLinearScale(data.poverty +.15);
    })
    .text(function(data) {
      return data.abbr
    });

// Build the TOOLTIPS and call it into the chart
var toolTip = d3.tip()
  .attr("class", "tooltip")
  .offset([45, -30])
  .html(function(d) {
    return (d.state);
  });

chartGroup.call(toolTip);

// Event listener for tooltips on and off
circlesGroup.on("mouseover", function(data) {
  toolTip.show(data, this);
})

.on("mouseout", function(data, index) {
    toolTip.hide(data);
});

  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - 50)
  .attr("x", 0 - 325)
  .attr("dy", "1em")
  .attr("class", "axisText")
  .text("Lacks Healthcare (%)");

chartGroup.append("text")
  .attr("x", 0 + 350 )
  .attr("y", 0 + 520 )
  .style("text-anchor", "middle")
  .attr("class", "axisText")
  .text("In Poverty (%)");

return circlesGroup;
});
