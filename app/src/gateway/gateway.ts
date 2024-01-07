import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server} from 'socket.io'
import {Logger, OnModuleInit} from "@nestjs/common";
@WebSocketGateway()
export class MyGateway implements OnModuleInit {
    private logger = new Logger(MyGateway.name);
    @WebSocketServer()
    server: Server

    onModuleInit(): any {
        this.server.on('connection', (socket)=> {
            console.log(socket.id);
            console.log('Connected')
        })
    }

    @SubscribeMessage('logger')
    onLogger(@MessageBody() body: any) {
        this.logger.log(body.message)
    }
    @SubscribeMessage('loggerError')
    onLoggerError(@MessageBody() body: any) {
        this.logger.error(body.message)
    }

}