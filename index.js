const mqServer = require('amqplib/callback_api')

const q = 'tasks';
 
function bail(err) {
  console.error(err);
  process.exit(1);
}
 
// Publisher 发布者
function publisher(conn) {
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.sendToQueue(q, Buffer.from('something to do'));
  }
  // 创建连接通道
  conn.createChannel(on_open);
}
 
// Consumer 消费者
function consumer(conn) {
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        console.log(msg.content.toString());
        ch.ack(msg);
      }
    });
  }
   // 创建连接通道
  conn.createChannel(on_open);
}
 

// URL="amqp://账号:密码&IP地址" 默认端口为 5672
mqServer.connect('amqp://admin:admin@192.168.33.117/', function(err, conn) {
  // 连接失败，直接进程退出，并且输出错误信息
  if (err != null) bail(err);
  consumer(conn);
  publisher(conn);
});