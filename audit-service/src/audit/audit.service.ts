import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async log(entry: any) {
        // Basic Risk Analysis could happen here
        let riskScore = 0;
        const riskFlags = [];

        // Trivial threat detection
        if (entry.status >= 500) {
            riskScore += 10;
            riskFlags.push('server_error');
        }
        if (entry.status === 401 || entry.status === 403) {
            riskScore += 20;
            riskFlags.push('auth_failure');
        }
        // E.g. Velocity check would check last N logs for this IP (not implemented for simplicity)

        return this.prisma.auditLog.create({
            data: {
                ...entry,
                riskScore,
                riskFlags,
            },
        });
    }

    async findAll() {
        return this.prisma.auditLog.findMany({
            orderBy: { timestamp: 'desc' },
            take: 100,
        });
    }
}
