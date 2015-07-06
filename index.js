var config = require("./config.json");
var fromArray = require("from2-array");
var jenkinsBuildsStream = require("./streams/jenkinsBuildsStream");
var jenkinsBuildsInfoStream = require("./streams/jenkinsBuildsInfoStream");
var jenkinsFailedBuildsFilterStream = require("./streams/jenkinsFailedBuildsFilterStream.js");
var jiraIssuesStream = require("./streams/jiraIssuesStream.js");
var jiraInfoStream = require("./streams/jiraInfoStream.js")(config.jiraHost);
var failuresAggregatorStream = require("./streams/failuresAggregatorStream.js");

fromArray.obj(config.jobs)
    .pipe(jenkinsBuildsStream)
    .pipe(jenkinsBuildsInfoStream)
    .pipe(jenkinsFailedBuildsFilterStream)
    .pipe(jiraIssuesStream)
    .pipe(jiraInfoStream)
    .pipe(failuresAggregatorStream);

var swigReportGenerator = require("./generators/swigReportGenerator");
failuresAggregatorStream.on("data", swigReportGenerator);
