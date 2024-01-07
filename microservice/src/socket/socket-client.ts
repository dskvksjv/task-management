import {Injectable, OnModuleInit} from "@nestjs/common";
import * as io from 'socket.io-client';


@Injectable()
export class SocketClient implements OnModuleInit {
    public socketClient: io.Socket
    constructor() {
        this.socketClient = io.connect('http://localhost:3000')
    }
    onModuleInit(): any {
        this.registerConsumerEvents()
    }

    private registerConsumerEvents() {
        this.socketClient.on('connect', ()=> {
            console.log('Connected to Gateway')
        })
    }
}
