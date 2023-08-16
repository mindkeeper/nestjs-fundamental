import { Controller, Get, Req, UseFilters, UseGuards } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/global-filters';
import { Request } from 'express';
import { jwtGuard } from 'src/auth/guard';
@UseFilters(HttpExceptionFilter)
@Controller('users')
export class UserController {
  @UseGuards(jwtGuard)
  @Get()
  getUser(@Req() req: Request) {
    return { user: req.user };
  }
}
