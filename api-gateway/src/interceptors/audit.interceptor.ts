import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, user, ip } = request;
        const now = Date.now();

        return next.handle().pipe(
            tap({
                next: (data) => {
                    this.sendAuditLog(request, 200); // Or try to capture real status if possible from context
                },
                error: (error) => {
                    this.sendAuditLog(request, error.status || 500);
                },
            }),
        );
    }

    private async sendAuditLog(request: any, status: number) {
        const auditUrl = this.configService.get<string>('AUDIT_SERVICE_URL');
        if (!auditUrl) return;

        try {
            this.httpService.post(`${auditUrl}/audit/log`, {
                userId: request.user?.sub || 'anonymous',
                ipAddress: request.ip || 'unknown',
                userAgent: request.headers['user-agent'],
                method: request.method,
                endpoint: request.url,
                status: status,
            }).subscribe(); // Fire and forget
        } catch (e) {
            console.error('Failed to send audit log', e.message);
        }
    }
}
