import { Controller, Post, Body, Get } from '@nestjs/common';
import { PolicyService, EvaluationRequest } from './policy.service';

@Controller('policies')
export class PolicyController {
    constructor(private policyService: PolicyService) { }

    @Post('check')
    async check(@Body() request: EvaluationRequest) {
        return this.policyService.evaluate(request);
    }

    @Post()
    async create(@Body() createDto: any) {
        return this.policyService.create(createDto);
    }

    @Get()
    async findAll() {
        return this.policyService.findAll();
    }
}
