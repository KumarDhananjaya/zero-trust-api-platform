import { Controller, All, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { PolicyGuard } from './guards/policy.guard';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) { }

  @All('auth/*')
  async proxyAuth(@Req() req: Request, @Res() res: Response) {
    const serviceUrl = this.configService.get('AUTH_SERVICE_URL');
    await this.proxyRequest(serviceUrl, req, res, '/auth');
  }

  @All('policies/*')
  @UseGuards(AuthGuard) // Protect policy management
  async proxyPolicy(@Req() req: Request, @Res() res: Response) {
    const serviceUrl = this.configService.get('POLICY_SERVICE_URL');
    await this.proxyRequest(serviceUrl, req, res, '/policies');
  }

  // Public Endpoint example (no guards)
  @All('public/*')
  async proxyPublic(@Req() req: Request, @Res() res: Response) {
    const serviceUrl = this.configService.get('AUTH_SERVICE_URL'); // Example
    await this.proxyRequest(serviceUrl, req, res, '/public');
  }

  // Generic Protected Services
  @All('*')
  @UseGuards(AuthGuard, PolicyGuard)
  async proxyGeneric(@Req() req: Request, @Res() res: Response) {
    // Determine target service based on path prefix? or just default to one backend?
    // For this POC, let's say "orders" service doesn't exist yet, but we have "audit-service" 
    // or maybe we just echo back for demo.

    // Let's assume everything else goes to an "Upstream Service"
    // Since we don't have a "Business Logic" service yet, I'll just return success.
    res.json({ message: "Gateway allowed this request!", user: (req as any).user });
  }

  private async proxyRequest(baseUrl: string, req: Request, res: Response, prefix: string) {
    try {
      // url: /auth/login -> target: http://localhost:3000/auth/login
      // If prefix is /auth, and we want to strip it? usually we keep it or strip it.
      // NestJS scaffolding created /auth/login. So we keep it.

      const url = `${baseUrl}${req.url}`;
      const method = req.method;
      const data = req.body;
      const headers = { ...req.headers };
      delete headers.host; // Avoid Host header confusion

      const response = await firstValueFrom(
        this.httpService.request({
          url,
          method: method as any,
          data,
          headers: headers as any,
          validateStatus: () => true, // Pass all statuses
        })
      );

      res.status(response.status).set(response.headers).send(response.data);
    } catch (error) {
      console.error('Proxy Error', error.message);
      res.status(502).json({ message: 'Bad Gateway' });
    }
  }
}
