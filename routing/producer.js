// 路由模式---生产者
const mqServer = require('amqplib');

const {
  RABBITMQ_CONFIG,
  RABBITMQ_CONFIG: { EXCHANGE_TYPE },
} = require('../config');

class Producer {
  constructor(severity) {
    this.ex = 'direct_logs';
    this.severity = severity;
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
    let ok = ch.assertExchange(this.ex, EXCHANGE_TYPE.direct, {
      durable: false,
    });

    return ok.then(() => {
      // 向交换机指定路由发送信息
      ch.publish(this.ex, this.severity, Buffer.from(msg));
      console.log(" [x] Sent %s:'%s'", this.severity, msg);
      return ch.close();
    });
  }
}

const argvList = process.argv.slice(2);

const severity = argvList.length > 0 ? argvList[0] : 'info';
const msg = argvList.slice(1).join(' ') || 'hello word';

const producer = new Producer(severity);

producer.send(msg);
