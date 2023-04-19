Open source Custom Vis Pie Chart using Amchart.js:

https://www.amcharts.com




To run locally, download the repo, then npm i, npm run build, and npm start.

Add the appropriate parameters to your manifest file in Looker. Something like this:

project_name: “custom-vis-pie-chart”

visualization: {
id: “custom-vis-pie-chart”
label: “Custom Vis Pie Chart amCharts”
url: “https://localhost:8080/bundle.js”

dependencies: [
“https://www.amcharts.com/lib/4/core.js”,
“https://www.amcharts.com/lib/4/charts.js”,
“https://www.amcharts.com/lib/4/themes/animated.js”
]

}

Then commit and deploy changes to see the visual displayed in Looker visualization options.
