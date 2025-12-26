import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
    constructor(private auditService: AuditService) { }

    @Post('log')
    async createLog(@Body() entry: any) {
        // Fire and forget usually, but here we await
        return this.auditService.log(entry);
    }

    @Get()
    async getLogs() {
        return this.auditService.findAll();
    }
}
