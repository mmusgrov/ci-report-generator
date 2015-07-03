var jobs = [
    {
        baseUrl: "http://albany.eng.hst.ams2.redhat.com",
        name: "narayana"
    },
    {
        baseUrl: "http://albany.eng.hst.ams2.redhat.com",
        name: "narayana-catelyn"
    },
    {
        baseUrl: "http://albany.eng.hst.ams2.redhat.com",
        name: "narayana-documentation"
    },
    {
        baseUrl: "http://albany.eng.hst.ams2.redhat.com",
        name: "narayana-quickstarts"
    },
    {
        baseUrl: "http://albany.eng.hst.ams2.redhat.com",
        name: "narayana-quickstarts-catelyn"
    }
]; // TODO get from config

var jiraHost = "issues.jboss.org"; // TODO get from config

var _ = require("underscore");
var fromArray = require("from2-array");
var jenkinsBuildsStream = require("./streams/jenkinsBuildsStream");
var jenkinsBuildsInfoStream = require("./streams/jenkinsBuildsInfoStream");
var jenkinsFailedBuildsFilterStream = require("./streams/jenkinsFailedBuildsFilterStream.js");
var jiraIssuesStream = require("./streams/jiraIssuesStream.js");
var jiraInfoStream = require("./streams/jiraInfoStream.js")(jiraHost);
var failuresAggregatorStream = require("./streams/failuresAggregatorStream.js");

fromArray.obj(jobs)
    .pipe(jenkinsBuildsStream)
    .pipe(jenkinsBuildsInfoStream)
    .pipe(jenkinsFailedBuildsFilterStream)
    .pipe(jiraIssuesStream)
    .pipe(jiraInfoStream)
    .pipe(failuresAggregatorStream);

var htmlReportGenerator = require("./generators/htmlReportGenerator.js");

// Failures aggregator should only push once
failuresAggregatorStream.on("data", htmlReportGenerator);
