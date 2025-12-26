import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PolicyGuard implements CanActivate {
    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Construct Resource/Action from request
        // E.g. POST /orders -> action: "create", resource: "orders"
        // For now, mapping method to action:
        const methodMap = {
            GET: 'read',
            POST: 'create',
            PUT: 'update',
            DELETE: 'delete',
        };

        const action = methodMap[request.method] || 'read';
        // Remove query params and leading slash
        const resource = request.path.replace(/^\/+/, '').split('/')[0] || 'root';

        const policyUrl = this.configService.get<string>('POLICY_SERVICE_URL');

        try {
            const response = await firstValueFrom(
                this.httpService.post(`${policyUrl}/policies/check`, {
                    user: user,
                    action: action,
                    resource: resource,
                    context: {
                        ip: request.ip,
                    }
                })
            );

            if (!response.data.allow) {
                throw new ForbiddenException(response.data.reason || 'Sudo says no');
            }
            return true;
        } catch (error) {
            if (error instanceof ForbiddenException) throw error;
            console.error('Policy Check Failed', error.message);
            // Fail closed
            throw new ForbiddenException('Policy check failed due to internal error');
        }
    }
}
