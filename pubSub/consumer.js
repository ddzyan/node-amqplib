// 发布订阅模式---生产者
const mqServer = require('amqplib');

const {
  RABBITMQ_CONFIG,
  RABBITMQ_CONFIG: { EXCHANGE_TYPE },
} = require('../config');

class Consumer {
  constructor() {
    this.qInfo = 'info';
    this.qWarn = 'warn';
    this.ex = 'logs';
  }

  async receive() {
    /* 
    1. 建立连接
    2. 创建信道
    3. 声明队列
    4. 声明交换机
    5. 队列绑定交换机
    6. 接收消息
    */
    try {
      const conn = await mqServer.connect(RABBITMQ_CONFIG.OPTIONS);
      process.once('SIGINT', function () {
        console.log('意外退出');
        conn.close();
      });
      const ch = await conn.createChannel();

      let ok = ch.assertExchange(this.ex, EXCHANGE_TYPE.fanout, {
        durable: false,
      });

      ok = ok.then(() => {
        ch.assertQueue(this.qInfo, { exclusive: false });
        return ch.assertQueue(this.qWarn, { exclusive: false });
      });

      ok = ok.then((qok) => {
        // 队列绑定交换机
        return ch.bindQueue(qok.queue, this.ex, '').then(() => {
          return qok.queue;
        });
      });

      ok = ok.then(function (queue) {
        return ch.consume(queue, logMessage, { noAck: true });
      });

      return ok.then(function () {
        console.log(' [*] Waiting for logs. To exit press CTRL+C');
      });

      function logMessage(msg) {
        console.log(" [x] '%s'", msg.content.toString());
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

const consumer = new Consumer();

consumer.receive();
