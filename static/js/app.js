// STEP 1

// Get the samples URL
const sampURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(sampURL).then(function(data) {
  console.log(data);

  // STEP 2

  let namely = data.names;
  console.log("Namely names", namely);

  //Populate the dropdown list
  var dropdownMenu = d3.select("#selDataset");
  namely.forEach(function(option) {
    dropdownMenu.append("option").text(option).property("value", option);
  });

  //Creating a function that updates bar chart and bubble chart when new ID is selected
  function updateCharts(sample) {
    // Filter the data to get the sample values, OTU ids, and OTU labels for the selected sample
    var filteredData = data.samples.filter(d => d.id === sample)[0];
    var sampleValues = filteredData.sample_values.slice(0, 10).reverse();
    var otuIds = filteredData.otu_ids.slice(0, 10).reverse().map(d => "OTU " + d);
    var otuLabels = filteredData.otu_labels.slice(0, 10).reverse();

    // Create the trace for the horizontal bar chart
    var barTrace = {
      x: sampleValues,
      y: otuIds,
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };

    // Define the data array and layout for the bar chart
    var barData = [barTrace];
    var barLayout = {
      title: "Top 10 OTUs",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    // Use Plotly to plot the bar chart to the "bar" div
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart
    var bubbleTrace = {
      x: filteredData.otu_ids,
      y: filteredData.sample_values,
      mode: "markers",
      marker: {
        size: filteredData.sample_values,
        color: filteredData.otu_ids,
        colorscale: "Earth"
      },
      text: filteredData.otu_labels
    };

    // Define the data array and layout for the bubble chart
    var bubbleData = [bubbleTrace];
    var bubbleLayout = {
      title: "OTU Samples",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    // Use Plotly to plot the bubble chart to the "bubble" div
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  }

  // Set the default sample to the first one in the dataset
  var defaultSample = namely[0];

  // Call the updateCharts function with the default sample to initialize the charts
  updateCharts(defaultSample);

  // Add an event listener to the dropdown menu to update the charts when a new sample is selected
  dropdownMenu.on("change", function() {
    var newSample = d3.select(this).property("value");
    updateCharts(newSample);
  });
});