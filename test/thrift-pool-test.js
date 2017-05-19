var thrift = require('thrift');
var Exception = require('./gen-nodejs/Exception_types');
var model = require('./gen-nodejs/ESmodel_types');
var SearchDataService = require('./gen-nodejs/SearchData');

var TFramedTransport = require('thrift/lib/nodejs/lib/thrift/transport').TFramedTransport;
var TBinaryProtocol = require('thrift/lib/nodejs/lib/thrift/protocol').TBinaryProtocol;

var genericPool = require('generic-pool');

const factory = {
    create: function(){
		 return new Promise(function(resolve, reject){
	        var connection = thrift.createConnection(
                '10.0.1.81',
                6060,
                {
                    transport : TFramedTransport,
                    protocol : TBinaryProtocol
                }
            );

            resolve(connection);
	    })
    },
    destroy: function(connection){
        return new Promise(function(resolve){
          connection.end();
          resolve();
        })
    }
}

var opts = {
    max: 20, // maximum size of the pool
    min: 10 // minimum size of the pool
}

var myPool = genericPool.createPool(factory, opts);

var j = 0;
var start = new Date().getTime();
for(var i = 0; i < 101; i++){
    myPool.acquire().then(function(connection) {
        var multiplexer = new thrift.Multiplexer();
        var client =  multiplexer.createClient("com.aleiye.client.service.search.SearchData",SearchDataService,connection);
                
        var qm = new model.TQueryModel();
        qm.queryString = '*:*';
        qm.a_from = 1483200000000;
        qm.a_to = new Date().getTime();
        client.query(qm,function (err,res) {
            console.log(j);
            myPool.release(connection);
            j++;
            if(j >= 101){
                var end = new Date().getTime();
                console.log(end - start);
            }
        });
    })
}
