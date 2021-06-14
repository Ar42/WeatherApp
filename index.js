const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace(
    "{%tempval%}",
    (orgVal.main.temp - 273).toFixed(2)
  );
  temperature = tempVal.replace(
    "{%tempmin%}",
    (orgVal.main.temp_min - 273).toFixed(2)
  );
  temperature = tempVal.replace(
    "{%tempmax%}",
    (orgVal.main.temp_max - 273).toFixed(2)
  );
  temperature = tempVal.replace("{%location%}", orgVal.name);
  temperature = tempVal.replace("{%country%}", orgVal.sys.country);
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=Mymensingh&appid=cc74969fcf5c991c00a9fc80292d6562"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        // console.log((arrData[0].main.temp - 273).toFixed(2));
        const realTimeData = arrData.map((val) => {
          console.log(val.main);
          replaceVal(homefile, val);
        });
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);

        console.log("end");
      });
  }
});

server.listen(8000, "127.0.0.1");
