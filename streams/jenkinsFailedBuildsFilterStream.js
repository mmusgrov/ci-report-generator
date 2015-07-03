var throughFilter = require("through2-filter");

module.exports = throughFilter({objectMode: true}, function(build) {
    // console.log("Checking if " + build.jobName + " build " + build.number + " has failed");
    
    return build.result !== null && build.result != "SUCCESS";
});
