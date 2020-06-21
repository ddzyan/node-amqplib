const mqServer = require('amqplib');

const { RABBITMQ_CONFIG } = require('../config');

const q = 'tasks';

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
    ch.assertQueue(q);
    ch.consume(q, (msg) => {
      if (msg !== null) {
        console.log(msg.content.toString());
        // 发送确认消息
        ch.ack(msg);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

producer();
