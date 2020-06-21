## 简介

nodejs 使用 amqplib 模块连接 rabbitmq 服务，实现消息的发送和接收

参考文档：https://github.com/squaremo/amqp.node/tree/master/examples/tutorials

消息队列的作用

1. 应用解耦
2. 任务异步处理
3. 流量消峰

rabbitMq5 种使用模式

1. 简单模式--hello word
2. 工作模式--work

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

一个生产者 P 发送消息到一个队列 Q,一个消费者 C 接收。

实例代码：helloWord 文件夹

![](https://i.imgur.com/rGIqlf3.png)

#### 工作模式

一个生产者 P 发送消息到一个队列 Q，多个消费者 C 按照绑定顺序依次接收消息。

实例代码：work 文件夹

![](https://i.imgur.com/awHUM0h.png)

#### 订阅模式(publish/subcribe)

生产者 P 往交换机 X 发送消息，交换机根据设定的交换机类型，将符合条件的信息发送到绑定的队列 Q，绑定指定队列的消费者 C 接收和处理消息

消息不再直接发送给队列，而是发送给交换机，由交换机推送到指定队列。但是交换机不具备存储消息的能力，所以如果没有符合条件的队列，则消息将丢失。

常见的交换机类型：

1. fanout：广播，将消息发送给所有绑定交换机的队列
2. topic：通配符，将消息发送给符合 routing parrtem 的队列种
3. direct：定向，将消息发送给指定的 routing key 队列种

![发布订阅模式](https://i.imgur.com/DMdhQIq.png)
