import { Kafka } from 'kafkajs';
import { logger } from '../logger/logger';

let kafka: Kafka | null = null;
let producer: any = null;
let consumer: any = null;

export async function connectKafka(): Promise<void> {
  try {
    if (!process.env.KAFKA_BROKER_URL) {
      logger.warn('Kafka broker URL not configured, skipping Kafka connection');
      return;
    }

    kafka = new Kafka({
      clientId: 'skills-engine-api',
      brokers: [process.env.KAFKA_BROKER_URL],
      retry: {
        initialRetryTime: 100,
        retries: 8
      }
    });

    // Create producer
    producer = kafka.producer();
    await producer.connect();
    logger.info('Kafka producer connected successfully');

    // Create consumer
    consumer = kafka.consumer({ groupId: 'skills-engine-group' });
    await consumer.connect();
    logger.info('Kafka consumer connected successfully');

    // Subscribe to topics
    await subscribeToTopics();

  } catch (error) {
    logger.error('Error connecting to Kafka:', error);
    throw error;
  }
}

async function subscribeToTopics(): Promise<void> {
  try {
    // Subscribe to assessment result events
    await consumer.subscribe({ 
      topic: 'assessment-result-available', 
      fromBeginning: false 
    });

    // Subscribe to user created events
    await consumer.subscribe({ 
      topic: 'user-created', 
      fromBeginning: false 
    });

    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const messageData = JSON.parse(message.value?.toString() || '{}');
          logger.info('Received Kafka message:', { topic, partition, messageData });

          // Process message based on topic
          switch (topic) {
            case 'assessment-result-available':
              await processAssessmentResultEvent(messageData);
              break;
            case 'user-created':
              await processUserCreatedEvent(messageData);
              break;
            default:
              logger.warn('Unknown topic received:', topic);
          }
        } catch (error) {
          logger.error('Error processing Kafka message:', error);
        }
      }
    });

    logger.info('Kafka topics subscribed successfully');
  } catch (error) {
    logger.error('Error subscribing to Kafka topics:', error);
    throw error;
  }
}

async function processAssessmentResultEvent(data: any): Promise<void> {
  try {
    // Import here to avoid circular dependency
    const { AssessmentService } = await import('@/application/services/assessment.service');
    const assessmentService = new AssessmentService();

    await assessmentService.processAssessmentResults(data);
    logger.info('Assessment result event processed successfully');
  } catch (error) {
    logger.error('Error processing assessment result event:', error);
  }
}

async function processUserCreatedEvent(data: any): Promise<void> {
  try {
    // Import here to avoid circular dependency
    const { UserService } = await import('@/application/services/user.service');
    const userService = new UserService();

    // Initialize user profile with AI skill extraction
    // This would integrate with OpenAI API for skill extraction
    logger.info('User created event processed successfully');
  } catch (error) {
    logger.error('Error processing user created event:', error);
  }
}

export async function publishEvent(topic: string, message: any): Promise<void> {
  try {
    if (!producer) {
      logger.warn('Kafka producer not available');
      return;
    }

    await producer.send({
      topic,
      messages: [{
        key: message.id || message.user_id || 'default',
        value: JSON.stringify(message),
        timestamp: Date.now().toString()
      }]
    });

    logger.info('Event published successfully:', { topic, messageId: message.id });
  } catch (error) {
    logger.error('Error publishing event:', error);
    throw error;
  }
}

export async function disconnectKafka(): Promise<void> {
  try {
    if (producer) {
      await producer.disconnect();
      logger.info('Kafka producer disconnected');
    }

    if (consumer) {
      await consumer.disconnect();
      logger.info('Kafka consumer disconnected');
    }
  } catch (error) {
    logger.error('Error disconnecting from Kafka:', error);
    throw error;
  }
}

