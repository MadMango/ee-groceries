import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Groceries } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/groceries')
  getGroceries(): Groceries {
    return this.appService.getGroceries();
  }

  @Put('/groceries')
  updateGroceries(@Body() newGroceries): Groceries {
    return this.appService.updateGroceries(newGroceries);
  }

  @Post('/groceries')
  addGroceries(@Body() newItem): Groceries {
    return this.appService.addGroceries(newItem);
  }

  @Post('/groceries/reset')
  resetGroceries(): Groceries {
    return this.appService.resetGroceries();
  }

  @Delete('/groceries/:id')
  deleteItem(@Param() params): Groceries {
    return this.appService.deleteItem(params.id);
  }
}
