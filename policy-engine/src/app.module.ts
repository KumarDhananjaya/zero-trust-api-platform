import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PolicyModule } from './policies/policy.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PolicyModule,
  ],
})
export class AppModule { }
