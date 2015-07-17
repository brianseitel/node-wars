 var http = require("http");
    var fs = require("fs");
    var path = require("path");
    var server = http.createServer(function(request, response) {
        //typically what will happen here is that you will see
        //see the request for the page (index.html?) first and
        //then the browser's subsequent requests for js, css etc files
        var url = request.url;
        var file = url.split("/");

        file.shift();
        file = file.join('/');
        try {
            var html = fs.readFileSync(file,"utf-8");
           //probably want to check the file extension here to determine the Content-Type
           response.writeHeader(200, {"Content-Type": "text/html"});  
           response.write(html);  
           response.end();
        } catch (ex) {
            
        }  
    });

server.listen(8000);
console.log("Server is listening");