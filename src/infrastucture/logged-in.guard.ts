import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ContextService } from './context.service';

export class LoggedInGuard implements CanActivate {
  constructor(@Inject('ContextService') private readonly contextService: ContextService) {
    console.log(this.contextService)
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return this.contextService.verifyToken(this.contextService.token);
  }

}
