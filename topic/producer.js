// 路由模式---通配符模式
const mqServer = require('amqplib');

const {
  RABBITMQ_CONFIG,
  RABBITMQ_CONFIG: { EXCHANGE_TYPE },
} = require('../config');

class Producer {
  constructor(key) {
    this.ex = 'topic_logs';
    this.key = key;
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
    try {
      const conn = await mqServer.connect(RABBITMQ_CONFIG.OPTIONS);
      // 进程关闭的时候，关闭连接通道
      process.once('SIGINT', () => {
        console.log('意外退出');
        conn.close();
      });
      const ch = await conn.createChannel();
      let ok = ch.assertExchange(this.ex, EXCHANGE_TYPE.topic, {
        durable: false,
      });

      return ok.then(() => {
        // 向交换机指定路由发送信息
        ch.publish(this.ex, this.key, Buffer.from(msg));
        console.log(" [x] Sent %s:'%s'", this.key, msg);
        return ch.close();
      });
    } catch (error) {
      console.error(error);
    }
  }
}

const argvList = process.argv.slice(2);

//log.add.info
const key = argvList.length > 0 ? argvList[0] : 'info';
const msg = argvList.slice(1).join(' ') || 'hello word';

const producer = new Producer(key);

producer.send(msg);

//node producer.js log.add.info
