import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CoffeesService } from './coffees.service';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  findAll(@Query() paginationQuery) {
    return this.coffeesService.findAll();
  }
  @Get('/:id')
  findOne(@Param('id') id: string) {
    const coffee = this.coffeesService.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Not found coffee with id- ${id}`);
    }
    return coffee;
  }
  @Post()
  create(@Body() body) {
    return this.coffeesService.create(body);
  }
  @Patch('/:id')
  update(@Param('id') id: string, @Body() body) {
    return this.coffeesService.update(id, body);
  }
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
