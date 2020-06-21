// 发布订阅模式---生产者
const mqServer = require('amqplib');

const {
  RABBITMQ_CONFIG,
  RABBITMQ_CONFIG: { EXCHANGE_TYPE },
} = require('../config');

class Producer {
  constructor() {
    this.qInfo = 'info';
    this.qWarn = 'warn';
    this.ex = 'logs';
  }

  async send(msg) {
    /* 
    1. 建立连接
    2. 创建信道
    3. 声明队列
    4. 声明交换机
    5. 队列绑定交换机
    5. 发送消息 --- 向所有消息队列发送消息
      1. 关闭通道
    */

    const conn = await mqServer.connect(RABBITMQ_CONFIG.OPTIONS);
    // 进程关闭的时候，关闭连接通道
    process.once('SIGINT', () => {
      console.log('意外退出');
      conn.close();
    });
    const ch = await conn.createChannel();
    let ok = ch.assertExchange(this.ex, EXCHANGE_TYPE.fanout, {
      durable: false,
    });

    ok = ok.then(() => {
      // 声明队列 开启独占
      ch.assertQueue(this.qInfo, { exclusive: false });
      return ch.assertQueue(this.qWarn, { exclusive: false });
    });

    ok = ok.then((qok) => {
      // 队列绑定交换机
      return ch.bindQueue(qok.queue, this.ex, '').then(() => {
        return qok.queue;
      });
    });

    return ok
      .then(() => {
        for (let i = 0; i < 10; i++) {
          ch.publish(this.ex, '', Buffer.from(msg));
          console.log(" [x] Sent '%s'", msg);
        }

        return ch.close();
      })
      .catch((err) => {
        console.warn(err);
        process.exit(1);
      });
  }
}

const producer = new Producer();

producer.send('Hello World!');
