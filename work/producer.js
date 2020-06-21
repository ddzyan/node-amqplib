// 发布订阅模式---生产者
const mqServer = require('amqplib');

const { RABBITMQ_CONFIG } = require('../config');

class Producer {
  constructor() {
    this.q = 'tasks_work';
  }

  async send(msg) {
    /* 
    1. 建立连接
    2. 创建信道
    3. 声明队列
    4. 发送消息
      1. 关闭队列
    */

    const conn = await mqServer.connect(RABBITMQ_CONFIG.OPTIONS);
    process.once('SIGINT', function () {
      console.log('意外退出');
      conn.close();
    });
    const ch = await conn.createChannel();
    const ok = ch.assertQueue(this.q);
    ok.then((_qok) => {
      ch.sendToQueue(this.q, Buffer.from(msg), { deliveryMode: true });
      console.log(" [x] Sent '%s'", msg);
      return ch.close();
    }).catch((err) => {
      console.warn(err);
      process.exit(1);
    });
  }
}

const producer = new Producer();

producer.send('hello word..........');
