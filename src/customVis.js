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
          min-height: 500px;
          width: 100%;

        }

      </style>
    `;


var visContainer = document.createElement('div');
visContainer.setAttribute("id", "chartdiv");
element.append(visContainer)

//am4core.addLicense("ch-custom-attribution");






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

        country: data[grouping_dim]["value"],
        count: data[plot_measure]["value"],

      });



    });





    am5.ready(function() {

    var root = am5.Root.new("chartdiv");


    var myTheme = am5.Theme.new(root);

    myTheme.rule("Grid", ["base"]).setAll({
      strokeOpacity: 0.1
    });


    root.setThemes([
      am5themes_Animated.new(root),
      myTheme
    ]);

    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none"
      })
    );



    var yRenderer = am5xy.AxisRendererY.new(root, { minGridDistance: 30 });
    yRenderer.grid.template.set("location", 1);

    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "country",
        renderer: yRenderer
      })
    );

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        renderer: am5xy.AxisRendererX.new(root, {
          visible: true,
          strokeOpacity: 0.1
        })
      })
    );



    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "count",
        sequencedInterpolation: true,
        categoryYField: "country"
      })
    );

    var columnTemplate = series.columns.template;

    columnTemplate.setAll({
      draggable: true,
      cursorOverStyle: "pointer",
      tooltipText: "drag to rearrange",
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      strokeOpacity: 0
    });
    columnTemplate.adapters.add("fill", (fill, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    columnTemplate.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    columnTemplate.events.on("dragstop", () => {
      sortCategoryAxis();
    });


    function getSeriesItem(category) {
      for (var i = 0; i < series.dataItems.length; i++) {
        var dataItem = series.dataItems[i];
        if (dataItem.get("categoryY") == category) {
          return dataItem;
        }
      }
    }


    // Axis sorting
    function sortCategoryAxis() {
      // Sort by value
      series.dataItems.sort(function(x, y) {
        return y.get("graphics").y() - x.get("graphics").y();
      });

      var easing = am5.ease.out(am5.ease.cubic);

      // Go through each axis item
      am5.array.each(yAxis.dataItems, function(dataItem) {
        // get corresponding series item
        var seriesDataItem = getSeriesItem(dataItem.get("category"));

        if (seriesDataItem) {
          // get index of series data item
          var index = series.dataItems.indexOf(seriesDataItem);

          var column = seriesDataItem.get("graphics");

          // position after sorting
          var fy =
            yRenderer.positionToCoordinate(yAxis.indexToPosition(index)) -
            column.height() / 2;

          // set index to be the same as series data item index
          if (index != dataItem.get("index")) {
            dataItem.set("index", index);

            // current position
            var x = column.x();
            var y = column.y();

            column.set("dy", -(fy - y));
            column.set("dx", x);

            column.animate({ key: "dy", to: 0, duration: 600, easing: easing });
            column.animate({ key: "dx", to: 0, duration: 600, easing: easing });
          } else {
            column.animate({ key: "y", to: fy, duration: 600, easing: easing });
            column.animate({ key: "x", to: 0, duration: 600, easing: easing });
          }
        }
      });


      yAxis.dataItems.sort(function(x, y) {
        return x.get("index") - y.get("index");
      });
    }



    yAxis.data.setAll(formattedData);
    series.data.setAll(formattedData);


    series.appear(1000);
    chart.appear(1000, 100);

    });


doneRendering()
  }
};

looker.plugins.visualizations.add(visObject);
