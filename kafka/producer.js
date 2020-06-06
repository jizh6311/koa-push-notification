require('dotenv').config();

const kafka = require('kafka-node');
const Producer = kafka.Producer;
const Client = kafka.KafkaClient;
const kafkaHost = process.env.KAFKA_HOST || 'localhost:9092';

const publish = (topic, message) => {
    // The client connects to a Kafka broker
    const client = new Client({ kafkaHost });
    // The producer handles publishing messages over a topic
    const producer = new Producer(client);

    // First wait for the producer to be initialized
    producer.on(
        'ready',
        () => {
            // Update metadata for the topic we'd like to publish to
            client.refreshMetadata(
                [topic],
                err => {
                    if (err) {
                        throw err;
                    }

                    console.log(`Sending message to ${topic}: ${message}`);
                    producer.send(
                        [{ topic, messages: [message] }],
                        (err, result) => {
                            console.log(err || result);
                            process.exit();
                        }
                    );
                }
            );
        }
    );
    
    producer.on(
        'error',
        err => {
            console.log('error', err);
        }
    );
}

exports.publish = publish;
