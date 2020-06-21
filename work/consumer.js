// 发布订阅模式---生产者
const mqServer = require('amqplib');

const { RABBITMQ_CONFIG } = require('../config');

class Consumer {
  constructor() {
    this.q = 'tasks_work';
  }

  async receive() {
    /* 
    1. 建立连接
    2. 创建信道
    3. 声明队列
    4. 接收消息
    */
    try {
      const conn = await mqServer.connect(RABBITMQ_CONFIG.OPTIONS);
      process.once('SIGINT', function () {
        console.log('意外退出');
        conn.close();
      });
      const ch = await conn.createChannel();
      let ok = ch.assertQueue(this.q);

      ok = ok.then(function () {
        ch.prefetch(1);
      });

      ok = ok.then(() => {
        ch.consume(this.q, doWork, { noAck: false });
        console.log(' [*] Waiting for messages. To exit press CTRL+C');
      });

      function doWork(msg) {
        const body = msg.content.toString();
        console.log(' [x] Received msg', body);
        const secs = body.split('.').length - 1;
        console.log(' [x] Task takes %d seconds', secs);
        setTimeout(function () {
          console.log(' [x] Done');
          // 延迟发送确认信息
          ch.ack(msg);
        }, secs * 1000);
      }

      return ok;
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }
}

const consumer = new Consumer();

consumer.receive();
