## 简介

nodejs 使用 amqplib 模块连接 rabbitmq 服务，实现消息的发送和接收

参考文档：https://github.com/squaremo/amqp.node/tree/master/examples/tutorials

### 消息队列的作用

1. 应用解耦
2. 任务异步处理
3. 流量消峰

## 使用

### docker 部署 rabbitMQ

```shell
# 拉去镜像 management 为带管理界面
docker pull rabbitmq:management

# 启动
docker run -dit --name Myrabbitmq -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin -p 15672:15672 -p 5672:5672 rabbitmq:management
```

### 登录后台

RabbitMQ 后台管理界面地址：http://192.168.100.117:15672

默认账号：admin

默认密码：admin

### 启动服务

```shell
yarn

cd helloWord

# 启动生产者第三个参数为消息内容
node ./producer.js

# 启动消费者
node ./consumer.js
```

### 模式价绍

#### 简单模式

实例代码：helloWord 文件夹

![](https://i.imgur.com/AYwjffM.png)
