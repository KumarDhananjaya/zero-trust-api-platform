import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface EvaluationRequest {
    user: {
        id: string;
        roles: string[];
        email?: string;
    };
    action: string;
    resource: string;
    context?: Record<string, any>; // IPs, time, etc.
}

@Injectable()
export class PolicyService {
    constructor(private prisma: PrismaService) { }

    async evaluate(request: EvaluationRequest): Promise<{ allow: boolean; reason?: string }> {
        const { user, action, resource } = request;

        // 1. Fetch potentially relevant policies. 
        // Optimization: Filter by roles or catch-all.
        const policies = await this.prisma.policy.findMany({
            where: {
                OR: [
                    { roles: { hasSome: user.roles } },
                    { roles: { isEmpty: true } }, // Global policies
                ],
            },
        });

        let allow = false;
        let deny = false;

        // 2. Iterate and evaluate
        for (const policy of policies) {
            // Check Action
            const actionMatch = policy.actions.includes('*') || policy.actions.includes(action);
            // Check Resource (Simple prefix match or exact)
            const resourceMatch = policy.resources.includes('*') ||
                policy.resources.includes(resource) ||
                (policy.resources.some(r => r.endsWith('*') && resource.startsWith(r.slice(0, -1))));

            if (actionMatch && resourceMatch) {
                // TODO: Check JSON conditions (ABAC) here

                if (policy.effect === 'deny') {
                    deny = true;
                    break; // Stop on first deny
                }
                if (policy.effect === 'allow') {
                    allow = true;
                }
            }
        }

        if (deny) return { allow: false, reason: 'Explicit deny' };
        if (!allow) return { allow: false, reason: 'No matching allow policy' };

        return { allow: true };
    }

    async create(data: any) {
        return this.prisma.policy.create({ data });
    }

    async findAll() {
        return this.prisma.policy.findMany();
    }
}
