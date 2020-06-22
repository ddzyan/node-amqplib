[TOC]

此文章内容核心为 nodejs 如何实现 [rabbitMq 的五种常见的工作模式](https://github.com/ddzyan/node-amqplib)，其余内容来自于百度/谷歌。

## RabbitMq 环境创建

### docker 构建

```shell
# 拉去镜像 management 为带管理界面
docker pull rabbitmq:management

# 启动
docker run -dit --name Myrabbitmq -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin -p 15672:15672 -p 5672:5672 rabbitmq:management
```

### 使用

RabbitMQ 后台管理界面地址：http://192.168.100.117:15672

默认账号：admin

默认密码：admin

## RabbitMQ 核心内容

rabbitMq 采用的消息体为 amqp(advance message queue protocol)高级消息队列协议，支持 restFul-Api 调用，支持跨语言。

消息队列的主要作用：

1. 服务解耦：承担微服务之间的消息通讯
2. 任务异步：将任务推送到消息队列种集中处理，不影响主进程处理进度。
3. 流量削峰：定时定量统一处理任务，防止因为高流量导致服务奔溃。

### 5 种工作模式

#### 简单模式(hello word)

生产者 P 往一个消息通道 Q 发送消息，并且由一个消费者 C 进行消费

![简单模式](https://i.imgur.com/rGIqlf3.png)

#### 工作模式(work)

生产者 P 往一个消息通道 Q 发送消息，并且由多个消费者 C 按照绑定顺序依次消费

![工作模式](https://i.imgur.com/awHUM0h.png)

#### 订阅模式(publish/subcribe)

生产者 P 往交换机 X 发送消息，交换机将符合条件的信息发送到绑定的队列 Q，绑定指定队列的消费者 C 接收和处理消息

消息不再直接发送给队列，而是发送给交换机，由交换机推送到指定队列。但是交换机不具备存储消息的能力，所以如果没有符合条件的队列，则消息将丢失。

如果声明多个相同名称的队列，并且都绑定到同一个交换机上，则发到交换机上此队列名称的消息，将发送完全相同的数据到这多个相同名称的队列中。

常见的交换机类型：

1. fanout：广播，将消息发送给所有绑定交换机的队列（发布订阅模式）
2. topic：通配符，将消息发送给符合 routing parrtem 的队列种（通配符模式）
3. direct：定向，将消息发送给指定的 routing key 队列种（路由模式）

![发布订阅模式](https://github.com/ddzyan/node-amqplib/blob/master/rabbitMq-%E5%8F%91%E5%B8%83%E6%A8%A1%E5%BC%8F.png)

#### 路由模式(router)

生产者 P 往交换机 X 发送消息，交换机再往符合条件的路由队列发送消息，绑定指定队列的消费者 C 接收和处理消息

#### 通配符模式(topic)
