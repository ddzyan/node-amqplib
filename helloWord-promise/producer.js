const mqServer = require('amqplib');

const { RABBITMQ_CONFIG } = require('../config');

const queueName = 'tasks';

const producer = async (msg) => {
  try {
    msg = typeof msg === 'object' ? JSON.stringify(msg) : msg;
    /* 
     1. 创建连接
     2. 创建信道
     3. 创建队列
     4. 发送信息
   */
    const conn = await mqServer.connect(RABBITMQ_CONFIG.OPTIONS);
    const ch = await conn.createChannel();
    ch.assertQueue(queueName);
    ch.sendToQueue(queueName, Buffer.from(msg));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

producer(process.argv[2]);
