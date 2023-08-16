import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/global-filters';
import { jwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
@UseFilters(HttpExceptionFilter)
@Controller('users')
export class UserController {
  @UseGuards(jwtGuard)
  @Get()
  getUser(@GetUser() user: User) {
    return { user };
  }
}
