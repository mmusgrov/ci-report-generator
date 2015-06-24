var jobs = [
    {
        baseUrl: "http://albany.eng.hst.ams2.redhat.com",
        name: "narayana"
    },
    {
        baseUrl: "http://albany.eng.hst.ams2.redhat.com",
        name: "narayana-catelyn"
    }
]; // TODO get from config

var jiraHost = "issues.jboss.org"; // TODO get from config

var _ = require("underscore");
var fromArray = require("from2-array");
var jenkinsBuildsStream = require("./jenkinsBuildsStream");
var jenkinsBuildsInfoStream = require("./jenkinsBuildsInfoStream");
var jenkinsFailedBuildsFilterStream = require("./jenkinsFailedBuildsFilterStream.js");
var jiraIssuesStream = require("./jiraIssuesStream.js");
var jiraInfoStream = require("./jiraInfoStream.js")(jiraHost);
var failuresAggregatorStream = require("./failuresAggregatorStream.js");

fromArray.obj(jobs)
    .pipe(jenkinsBuildsStream)
    .pipe(jenkinsBuildsInfoStream)
    .pipe(jenkinsFailedBuildsFilterStream)
    .pipe(jiraIssuesStream)
    .pipe(jiraInfoStream)
    .pipe(failuresAggregatorStream);

var reportGenerator = require("./reportGenerator.js")(jiraHost);
// Failures aggregator should only push once
failuresAggregatorStream.on("data", reportGenerator);
