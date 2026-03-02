import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const client: Socket = context.switchToWs().getClient();

        // MOCK: Aquí iría la lógica real para extraer y verificar el JWT
        // const token = client.handshake.headers.authorization;

        // Simulamos que pasamos la autenticación anexando un usuario al socket
        (client as any).user = { id: 'mock-user-id' };

        return true;
    }
}
