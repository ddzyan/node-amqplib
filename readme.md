## 简介
nodejs 使用 amqplib 模块连接 rabbitmq服务，实现消息的发送和接收

### 消息队列的作用
1. 应用解耦
2. 任务异步处理
3. 流量消峰

## 使用
### docker部署rabbitMQ
```shell
# 拉去镜像 management 为带管理界面
docker pull rabbitmq:management

# 启动
docker run -dit --name Myrabbitmq -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin -p 15672:15672 -p 5672:5672 rabbitmq:management
```

RabbitMQ后台管理界面地址：192.168.33.117:15672

### 启动服务
```shell
yarn 

node index
```