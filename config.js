/*
 * @Author: dingdongzhao
 * @Date: 2020-06-21 13:52:28
 * @Last Modified by: dingdongzhao
 * @Last Modified time: 2020-06-21 16:27:45
 */

// 配置文件
exports.RABBITMQ_CONFIG = {
  OPTIONS: {
    protocol: 'amqp',
    hostname: '192.168.100.117', // 连接地址
    port: 5672,
    username: 'admin',
    password: 'admin',
  },
};
