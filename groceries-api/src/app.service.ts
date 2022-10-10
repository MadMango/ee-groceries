import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import groceriesJSON from '../fixtures/groceries';
import { Groceries } from './types';
let inMemoryGroceries = [...groceriesJSON];

@Injectable()
export class AppService {
  getGroceries(): Groceries {
    return inMemoryGroceries;
  }

  updateGroceries(newGroceries): Groceries {
    if (!Array.isArray(newGroceries)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Request has to be an array',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const invalidEntry = newGroceries.find(({ id, name }) => !id || !name);

    if (invalidEntry) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error:
            'Properties are missing, please ensure you provide id, name and ticked properties for all items',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const tickedGroceries = newGroceries.filter(({ ticked }) => ticked);
    const untickedGroceries = newGroceries.filter(({ ticked }) => !ticked);

    inMemoryGroceries = [...untickedGroceries, ...tickedGroceries].map(
      (item, index) => ({
        ...item,
        order: index,
      }),
    );
    return inMemoryGroceries;
  }

  addGroceries(newItem): Groceries {
    const { name, ticked = false } = newItem;

    if (!name) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Please provide a name',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const tickedGroceries = inMemoryGroceries.filter(({ ticked }) => ticked);
    const untickedGroceries = inMemoryGroceries.filter(({ ticked }) => !ticked);

    inMemoryGroceries = [
      ...untickedGroceries,
      {
        id: nanoid(6),
        name,
        ticked,
      },
      ...tickedGroceries,
    ].map((item, index) => ({
      ...item,
      order: index,
    }));

    return inMemoryGroceries;
  }

  resetGroceries(): Groceries {
    inMemoryGroceries = [...groceriesJSON];
    return inMemoryGroceries;
  }

  deleteItem(paramId): Groceries {
    inMemoryGroceries = inMemoryGroceries.filter(({ id }) => id !== paramId);
    inMemoryGroceries = inMemoryGroceries.map((item, index) => ({
      ...item,
      order: index,
    }));

    return inMemoryGroceries;
  }
}
