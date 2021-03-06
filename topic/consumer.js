// 路由模式---通配符模式
const mqServer = require('amqplib');
const { all } = require('bluebird');
const { basename } = require('path');

const {
  RABBITMQ_CONFIG,
  RABBITMQ_CONFIG: { EXCHANGE_TYPE },
} = require('../config');

class Consumer {
  constructor() {
    this.q = 'direct';
    this.keyList = ['log.#', 'info'];
    this.ex = 'topic_logs';
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
      const ch = await conn.createChannel();
      process.once('SIGINT', function () {
        console.log('意外退出');
        ch.close();
        conn.close();
      });

      // durable 持久化
      let ok = ch.assertExchange(this.ex, EXCHANGE_TYPE.topic, {
        durable: false,
      });

      ok = ok.then(() => {
        // exclusive 独占
        return ch.assertQueue(this.q, { exclusive: false });
      });

      ok = ok.then((qok) => {
        const { queue } = qok;
        // 队列绑定交换机,设定路由
        return all(
          this.keyList.map((key) => {
            ch.bindQueue(queue, this.ex, key);
          })
        ).then(() => queue);
      });

      ok = ok.then(function (queue) {
        return ch.consume(queue, logMessage, { noAck: true });
      });

      return ok.then(function () {
        console.log(' [*] Waiting for logs. To exit press CTRL+C');
      });

      function logMessage(msg) {
        console.log(
          " [x] %s:'%s'",
          msg.fields.routingKey,
          msg.content.toString()
        );
      }
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

const consumer = new Consumer();

consumer.receive();
