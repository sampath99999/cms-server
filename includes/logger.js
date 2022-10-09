const fs = require("fs");
const logging = false
module.exports = (data) => {
    if(logging == false){
        return
    }
    var fileName = "./log.json";
    fs.readFile(fileName, function (err, fdata) {
        var json = JSON.parse(fdata);
        json.logs.push(data);
        fs.writeFile(fileName, JSON.stringify(json), function (err, result) {
            if (err) console.log("error", err);
        });
    });
};
