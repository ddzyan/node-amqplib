const mqServer = require('amqplib');

const { RABBITMQ_CONFIG } = require('../config');

const q = 'tasks';
const producer = async (msg) => {
  try {
    msg = typeof msg === 'object' ? JSON.stringify(msg) : msg;
    /* 
     1. 创建连接
     2. 创建信道
     3. 声明队列
     4. 发送信息
     5. 关闭通道
   */
    const conn = await mqServer.connect(RABBITMQ_CONFIG.OPTIONS);
    process.once('SIGINT', function () {
      conn.close();
    });
    const ch = await conn.createChannel();
    const ok = ch.assertQueue(q);
    return ok
      .then(function (_qok) {
        /* 注意:' sentToQueue '和' publish '都返回一个布尔值
        指示是否可以立即再次发送，或者
        (当' false ')，应该等待事件'drain'
       */
        ch.sendToQueue(q, Buffer.from(msg));
        console.log(" [x] Sent '%s'", msg);
        return ch.close();
      })
      .catch(console.warn);
  } catch (error) {
    console.error(error);
  }
};

producer({ name: 'ddz', mag: 'hello word' });
