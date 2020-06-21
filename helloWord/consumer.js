const mqServer = require('amqplib');

const { RABBITMQ_CONFIG } = require('../config');

const q = 'tasks';
const consumer = async (msg) => {
  try {
    msg = typeof msg === 'object' ? JSON.stringify(msg) : msg;
    /* 
     1. 创建连接
     2. 创建信道
     3. 声明队列
     4. 接收信息
   */
    const conn = await mqServer.connect(RABBITMQ_CONFIG.OPTIONS);
    // 监听退出信号，关闭信道
    process.once('SIGINT', function () {
      conn.close();
    });
    const ch = await conn.createChannel();
    let ok = ch.assertQueue(q);
    ok = ok.then(function (_qok) {
      return ch.consume(
        q,
        function (msg) {
          console.log(" [x] Received '%s'", msg.content.toString());
        },
        { noAck: true }
      );
    });

    return ok.then(function (_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

consumer();
