require('dotenv').config();
const kafka = require('kafka-node');
const Producer = kafka.Producer;
const Consumer = kafka.Consumer;
const Client = kafka.KafkaClient;
const Offset = kafka.Offset;
const kafkaHost = process.env.KAFKA_HOST || 'localhost:9092';

const MAX_WAIT_MS = 1000;
const MAX_BYTES = 1024 * 1024;

const kafkaSubscribe = (topic, send) => {
    const client = new Client({ kafkaHost });
    const topics = [{ topic: topic, partition: 0 }];
    const options = { autoCommit: false, fetchMaxWaitMs: MAX_WAIT_MS, fetchMaxBytes: MAX_BYTES };

    const consumer = new Consumer(client, topics, options);

    consumer.on('error', err => {
        console.log('error', err);
    });

    client.refreshMetadata(
        [topic],
        err => {
            const offset = new Offset(client);

            if (err) {
                throw err;
            }

            consumer.on('message', message => {
                send(message);
            });

            /*
             * If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
             */
            consumer.on(
                'offsetOutOfRange',
                topic => {
                    offset.fetch([topic], (err, offsets) => {
                        if (err) {
                            return console.error(err);
                        }
                        const min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
                        consumer.setOffset(topic.topic, topic.partition, min);
                    });
                }
            );
        }
    );
}
