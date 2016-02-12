var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var token = require('../libs/token');
var trigger = require('./run').trigger;

var KAFKA_CONNECTION_STRING = require('../constant').KAFKA_CONNECTION_STRING;
var KAFKA_CLIENT_ID = require('../constant').KAFKA_CLIENT_ID;
var KAFKA_TOPIC = require('../constant').KAFKA_TOPIC;

var client = new kafka.Client(KAFKA_CONNECTION_STRING, KAFKA_CLIENT_ID);
var consumer = new Consumer(client, [{
  topic: KAFKA_TOPIC,
  partition: 0
}], {
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024*1024
});
var offset = new Offset(client);

consumer.on('message', function (message) {
  var data = parseMessage(message);
  if (!data || !data.token || !data.params) {
    console.error('Kafka message data is not valid.');
    return;
  }
  triggerMigrate(data.token, data.params);
});

consumer.on('error', function (err) {
  console.error('Error', err);
});

/*
* If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
*/
consumer.on('offsetOutOfRange', function (topic) {
    offset.fetch([topic], function (err, offsets) {
      var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
      consumer.setOffset(topic.topic, topic.partition, min);
    });
});

function triggerMigrate(authToken, params) {
  token.init(function() {
    token.getToken(authToken, function(err, data) {
      if (!data) {
        console.error('No token found.');
        return;
      }
      trigger(data.name, params);
    });
  });
}

function parseMessage(message) {
  var data;
  try {
    data = JSON.parse(message.value);
  } catch(e) {
    console.error('Error parsing the kafka message.');
  }
  return data;
}
