var baseUrl = "http://albany.eng.hst.ams2.redhat.com"; // TODO get from config
var jobNames = ["narayana", "narayana-quickstarts"]; // TODO get from config

var JenkinsBuildsStream = require("./JenkinsBuildsStream");

var jenkinsBuildsStream = new JenkinsBuildsStream({baseUrl: baseUrl, jobNames: jobNames});

jenkinsBuildsStream.pipe(process.stdout);
