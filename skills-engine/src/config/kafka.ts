import { KafkaClient, Producer, Consumer, Message } from 'kafka-node';
import { logger } from '../utils/logger';

let kafka: KafkaClient;
let producer: Producer;
let consumer: Consumer;

export async function connectKafka(): Promise<void> {
  try {
    const kafkaHosts = process.env.KAFKA_BROKERS || 'localhost:9092';
    
    kafka = new KafkaClient({
      kafkaHost: kafkaHosts,
      clientId: process.env.KAFKA_CLIENT_ID || 'skills-engine'
    });

    // Create producer
    producer = new Producer(kafka);
    
    producer.on('ready', () => {
      logger.info('Kafka producer ready');
    });

    producer.on('error', (err) => {
      logger.error('Kafka producer error:', err);
    });

    // Create consumer
    consumer = new Consumer(kafka, [
      { topic: 'user-created', partition: 0 },
      { topic: 'assessment-completed', partition: 0 },
      { topic: 'skill-verified', partition: 0 }
    ], {
      groupId: process.env.KAFKA_GROUP_ID || 'skills-engine-group',
      autoCommit: true,
      autoCommitIntervalMs: 5000
    });

    consumer.on('message', (message: Message) => {
      handleKafkaMessage(message);
    });

    consumer.on('error', (err) => {
      logger.error('Kafka consumer error:', err);
    });

    logger.info('Kafka connection established');
  } catch (error) {
    logger.error('Kafka connection failed:', error);
    throw error;
  }
}

export async function disconnectKafka(): Promise<void> {
  try {
    if (producer) {
      producer.close();
    }
    if (consumer) {
      consumer.close(() => {});
    }
    logger.info('Kafka connection closed');
  } catch (error) {
    logger.error('Error closing Kafka connection:', error);
    throw error;
  }
}

export function getProducer(): Producer {
  if (!producer) {
    throw new Error('Kafka producer not initialized');
  }
  return producer;
}

export function getConsumer(): Consumer {
  if (!consumer) {
    throw new Error('Kafka consumer not initialized');
  }
  return consumer;
}

// Event publishing functions
export async function publishEvent(topic: string, message: any): Promise<void> {
  try {
    const payload = {
      topic,
      messages: [JSON.stringify(message)],
      partition: 0
    };

    producer.send([payload], (err, data) => {
      if (err) {
        logger.error('Error publishing event:', err);
      } else {
        logger.info(`Event published to topic ${topic}:`, data);
      }
    });
  } catch (error) {
    logger.error('Error publishing event:', error);
    throw error;
  }
}

// Event handling functions
async function handleKafkaMessage(message: Message): Promise<void> {
  try {
    const data = JSON.parse(message.value?.toString() || '{}');
    const topic = message.topic;

    logger.info(`Received message from topic ${topic}:`, data);

    switch (topic) {
      case 'user-created':
        await handleUserCreatedEvent(data);
        break;
      case 'assessment-completed':
        await handleAssessmentCompletedEvent(data);
        break;
      case 'skill-verified':
        await handleSkillVerifiedEvent(data);
        break;
      default:
        logger.warn(`Unknown topic: ${topic}`);
    }
  } catch (error) {
    logger.error('Error handling Kafka message:', error);
  }
}

async function handleUserCreatedEvent(data: any): Promise<void> {
  try {
    // Initialize user competency profile
    logger.info('Handling user created event:', data);
    // Implementation for user profile initialization
  } catch (error) {
    logger.error('Error handling user created event:', error);
  }
}

async function handleAssessmentCompletedEvent(data: any): Promise<void> {
  try {
    // Process assessment results and update competencies
    logger.info('Handling assessment completed event:', data);
    // Implementation for assessment result processing
  } catch (error) {
    logger.error('Error handling assessment completed event:', error);
  }
}

async function handleSkillVerifiedEvent(data: any): Promise<void> {
  try {
    // Update skill verification status
    logger.info('Handling skill verified event:', data);
    // Implementation for skill verification update
  } catch (error) {
    logger.error('Error handling skill verified event:', error);
  }
}
