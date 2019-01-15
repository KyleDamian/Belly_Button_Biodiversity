function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  var meta_url = `/metadata/${sample}`;
  d3.json(meta_url).then(function(results) {
    console.log(results);

    data = results;

    // Use `.html("") to clear any existing metadata
    var sample_metadata = d3.select("#sample-metadata")
    
    sample_metadata.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(function(object) {
      var row = sample_metadata.append("p");
      row.text(`${object}`);
    });

  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(results) {
    //console.log(results);

    // @TODO: Build a Bubble Chart using the sample data

    var bubble = d3.select("#bubble")
    var data = [results];

    var layout = {
      x: data.otu.ids,
      y: data.sample_values,
      mode: 'markers',
      marker: {
        color: 'rgb(31, 119, 180)',
        size: data.sample_values,
        text: data.otu_labels
      },
      type: 'scatter'
    };

    Plotly.plot(bubble, data, layout);

  });



    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  // fetch the sample date fromm /samples route
  var url = "/samples/<sample>";
  d3.json(url).then(function(results) {
    console.log(results);

    //Build a pie Chart
    var data = [results];

    var layout = {
      title: "Belly Button Pie",
      height: 500,
      weight: 500
    }

    Plotly.plot("pie", data, layout)
  });

  // //function to update data of pie chart
  // function updatePlotly (route) {
  //   Plotly.restyle("pie", "otu_ids", newdata.otu_ids)
  //   Plotly.restyle("pie", "sample_values", newdata.sample_values)
  // }

  // // Get new data whenever the dropdown selection changes
  // function getData(route) {
  //   console.log(route);
  //   d3.json(`/${route}`).then(function(data) {
  //     console.log("newdata", data);
  //     updatePlotly(data);
  //   });
  // };
};

buildCharts();

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
