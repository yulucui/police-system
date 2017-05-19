/**
 * Created by yulucui on 17/3/7.
 */
var thrift = require('thrift');
var Exception = require('./gen-nodejs/Exception_types');
var model = require('./gen-nodejs/ESmodel_types');
var SearchDataService = require('./gen-nodejs/SearchData');



// var transport = thrift.TBufferedTransport();
// var protocol = thrift.TBinaryProtocol();
var TFramedTransport = require('thrift/lib/nodejs/lib/thrift/transport').TFramedTransport;
var TBinaryProtocol = require('thrift/lib/nodejs/lib/thrift/protocol').TBinaryProtocol;

var j = 0;
var start = new Date().getTime();
for(var i = 0; i < 101; i++){
    var connection = thrift.createConnection(
        '10.0.1.81',
        6060,
        {
            transport : TFramedTransport,
            protocol : TBinaryProtocol
        }
    );

    // var serviceProtocol = thrift.createMultiplexServer(connection,RDictTableService);
    var multiplexer = new thrift.Multiplexer();
    var client =  multiplexer.createClient("com.aleiye.client.service.search.SearchData",SearchDataService,connection);
    // var client = thrift.createClient(RDictTableService,connection);
    var qm = new model.TQueryModel();
    qm.queryString = '*:*';
    qm.a_from = 1483200000000;
    qm.a_to = new Date().getTime();
    client.query(qm,function (err,res) {
        console.log(j);
        connection.end();
        j++;
        if(j >= 100){
            var end = new Date().getTime();
            console.log(end - start);
        }
    });
}
// client.getAll
// client.sayHello('yancao-cs','*:*','',function(err,result){
//     if(err){
//         console.log(err);
//         return ;
//     }
//     console.log(result);
// });

// var connection = thrift.createConnection("10.0.1.81", 6060, {
//     transport : TFramedTransport,
//     protocol : TJSONProtocol,
// });
//
// var client = thrift.createClient(RDictTableService,connection);
//
// client.getDictById(1,false,function(err,result){
//     if(err){
//         console.log(err);
//         return ;
//     }
//     console.log(result);
// });