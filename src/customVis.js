const visObject = {

create: function (element, config) {},

  updateAsync: function(data, element, config, queryResponse, details, doneRendering){


    element.innerHTML = "";
    element.innerHTML = `
      <style>
       @import url(https://fonts.googleapis.com/css?family=Open+Sans);

         body{
          font-family: 'Open Sans',serif;
          font-weight:bold
         }
        #chartdiv {
          height:100%;
          min-height: 600px;

          width: 100%;

        }

      </style>
    `;


var visContainer = document.createElement('div');
visContainer.setAttribute("id", "chartdiv");
element.append(visContainer)




//define conditions of data

    const hasOneDimensions = queryResponse.fields.dimensions.length === 1;
    const hasOneMeasure = queryResponse.fields.measures.length === 1;
    // const isMeasureNumeric = queryResponse.fields.measures[0]?.is_numeric;


//write error for unmet conditions

    if (!hasOneDimensions || !hasOneMeasure ) {

      element.innerHTML = "<p style='text-align:center;font-size:1.25em;padding-top:2em;font-family: 'Open Sans',serif;'>Incompatible Data. This chart requires <em>one dimension</em> and <em>one measure</em>.<br>For example, name and count.</p>";

    }



    formattedData = []



    const grouping_dim = queryResponse.fields.dimensions[0].name;

    const plot_measure = queryResponse.fields.measures[0].name;

    console.log(grouping_dim)
    console.log(plot_measure)


    data.forEach(function(data) {
      formattedData.push({

        name: data[grouping_dim]["value"],
        count: data[plot_measure]["value"],

      });


    });



    am4core.ready(function() {


      am4core.useTheme(am4themes_animated);

      var chart = am4core.create("chartdiv", am4plugins_sunburst.Sunburst);
      chart.padding(0,0,0,0);
      chart.radius = am4core.percent(98);




      const objData = {};

      formattedData.forEach((item) => {
        if (!objData.hasOwnProperty(item.name)) {
          objData[item.name] = [item];
        } else {
          objData[item.name] = [...objData[item.name], item];
        }
      });

      const resultData = Object.keys(objData).map((key) => {
        return {
          name: key,
          children: objData[key],
        };
      });
      console.log(resultData);

      chart.data = resultData;


      console.log(chart.data)



      chart.colors.step = 2;
      chart.fontSize = 11;
      chart.innerRadius = am4core.percent(10);

      chart.dataFields.value = "count";
      chart.dataFields.name = "name";
      chart.dataFields.children = "children";


      var level0SeriesTemplate = new am4plugins_sunburst.SunburstSeries();
      level0SeriesTemplate.hiddenInLegend = false;
      chart.seriesTemplates.setKey("0", level0SeriesTemplate)

      level0SeriesTemplate.labels.template.truncate = true;
      level0SeriesTemplate.labels.template.hideOversized = true;

      level0SeriesTemplate.labels.template.adapter.add("rotation", function(rotation, target) {
        target.maxWidth = target.dataItem.slice.radius - target.dataItem.slice.innerRadius - 10;
        target.maxHeight = Math.abs(target.dataItem.slice.arc * (target.dataItem.slice.innerRadius + target.dataItem.slice.radius) / 2 * am4core.math.RADIANS);

        return rotation;
      })


      var level1SeriesTemplate = level0SeriesTemplate.clone();
      chart.seriesTemplates.setKey("1", level1SeriesTemplate)
      level1SeriesTemplate.fillOpacity = 0.75;
      level1SeriesTemplate.hiddenInLegend = true;

      var level2SeriesTemplate = level0SeriesTemplate.clone();
      chart.seriesTemplates.setKey("2", level2SeriesTemplate)
      level2SeriesTemplate.fillOpacity = 0.5;
      level2SeriesTemplate.hiddenInLegend = true;

      chart.legend = new am4charts.Legend();

    });


doneRendering()
  }
};

looker.plugins.visualizations.add(visObject);
