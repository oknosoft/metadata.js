/**
 * Created by unpete on 02.04.2015.
 */

var soap = require('soap'),
    url = 'http://paperless/n/zd/1/ws/builder.light?wsdl',
    args = {name: 'value'},
    xml = require('fs').readFileSync('../data/order_dealer.wsdl', 'utf8'),
    myService = {
        Builder: {
            BuilderSoap: {

                exec: function(args) {

                    return args.param;
                },

                // This is how to define an asynchronous function.
                exec_async: function(args, callback) {
                    // do some work
                    callback({
                        name: args.name
                    })
                },

                // This is how to receive incoming headers
                exec_headers: function(args, cb, headers) {
                    return {
                        name: headers.Token
                    };
                }
            }
        }
    },
    http_server = require("http").createServer(function(request,response) {

        soap.createClient(url, function(err, client) {
            client.exec(args, function(err, result) {
                console.log(result);
            });
        });

        response.end("404: Not Found: "+request.url)
    });

http_server.listen(8000);
//http_server.on('request', function (request, response) {
//    //response.setHeader("Access-Control-Allow-Origin", "*");
//
//});

var soap_server = soap.listen(http_server, '/n/zd/1/ws/builder.light', myService, xml);
//soap_server.on('headers', function(headers, methodName) {
//        // It is possible to change the value of the headers
//        // before they are handed to the service method.
//        // It is also possible to throw a SOAP Fault
//        if(methodName == "OPTIONS"){
//        }
//    });
//soap_server.on('request', function (request, methodName) {
////    request.setHeader("Access-Control-Allow-Origin", "*");
//
//});
//soap_server.authenticate = function(security) {
//    var created, nonce, password, user, token;
//    token = security.UsernameToken, user = token.Username,
//        password = token.Password, nonce = token.Nonce, created = token.Created;
//    return user === 'user' && password === soap.passwordDigest(nonce, created, 'password');
//};