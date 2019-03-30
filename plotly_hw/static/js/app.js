function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`
  d3.json(url).then(function(data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var selector = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    selector.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(data).forEach(function([key,value]) {
      selector.append("div").text(`${key.toUpperCase()}: ${value}`);
    });
  });


    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(data => {
    var sortable = [];
    var idData = data.otu_ids;
    var sampleData = data.sample_values;
    var labelData = data.otu_labels;
    for (i=0; i<data.otu_ids.length; i++) {
      var entry = {"id": idData[i], "value": sampleData[i], "label": labelData[i]};
      sortable.push(entry);
    };
    
    sortable.sort(function(a,b) {
      return b['value'] - a['value'];
    });
        
    var otu_ids = [];
    var sample_values = [];
    var otu_labels = [];

    sortable.slice(0,10).forEach(function(entry) {
      var id = entry['id'];
      var value = entry['value'];
      var label = entry['label'];

      otu_ids.push(id);
      sample_values.push(value);
      otu_labels.push(label);
    });

    // @TODO: Build a Bubble Chart using the sample data
    trace1 = {
      x: idData,
      y: sampleData,
      type: "scatter",
      mode: "markers",
      marker: {
        size: sampleData,
        color: idData,
      },
      text: labelData,
    };
    data = [trace1];
    layout = {};
    Plotly.newPlot("bubble", data, layout);
    // @TODO: Build a Pie Chart
    trace2 = {
      labels : otu_ids,
      values : sample_values,
      type : "pie",
      text: otu_labels,
    };
    data = [trace2];
    layout = {};
    Plotly.newPlot("pie", data, layout);
  });
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
};

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

    // Use the first sample from the list to build the initial plots
    });
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
