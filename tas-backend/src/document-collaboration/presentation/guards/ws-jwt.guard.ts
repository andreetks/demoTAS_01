import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const client: Socket = context.switchToWs().getClient();

        const token =
            client.handshake.auth?.token ||
            client.handshake.headers?.authorization?.replace('Bearer ', '');

        if (!token) return false;

        try {
            const payload = this.jwtService.verify(token);
            (client as any).user = { id: payload.sub, email: payload.email, role: payload.role };
            return true;
        } catch {
            return false;
        }
    }
}
