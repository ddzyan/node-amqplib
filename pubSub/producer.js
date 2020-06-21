// 发布订阅模式---生产者
const mqServer = require('amqplib');

const { RABBITMQ_CONFIG } = require('../config');

class Producer {
  constructor() {
    this.q = 'tasks';
  }
}
