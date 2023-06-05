import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import groceries from '../fixtures/groceries';
import { AppController } from './app.controller';
import { AppModule } from './app.module';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    await appController.resetGroceries();
  });

  describe('groceries api', () => {
    it('should return groceries', () => {
      expect(appController.getGroceries()).toStrictEqual(groceries);
    });

    it('should add groceries and maintain correct order', () => {
      expect(
        appController.addGroceries({
          name: 'Potato 🥔',
          quantity: 2,
        }),
      ).toStrictEqual([
        ...groceries,
        {
          id: expect.any(String),
          order: 6,
          quantity: 2,
          name: 'Potato 🥔',
          ticked: false,
        },
      ]);
    });

    it('should default the quantity', () => {
      expect(
        appController.addGroceries({
          name: 'Potato 🥔',
        }),
      ).toStrictEqual([
        ...groceries,
        {
          id: expect.any(String),
          order: 6,
          quantity: 1,
          name: 'Potato 🥔',
          ticked: false,
        },
      ]);
    });

    it('should throw an error if name is not provided', async () => {
      try {
        await appController.addGroceries({});
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getResponse()).toStrictEqual({
          status: 400,
          error: 'Please provide a name',
        });
      }
    });

    it('should reset groceries', async () => {
      expect(appController.resetGroceries()).toStrictEqual(groceries);
    });

    it('should update groceries', async () => {
      expect(
        appController.updateGroceries([{ id: 'test', name: 'test' }]),
      ).toStrictEqual([{ id: 'test', name: 'test', order: 0 }]);
    });

    it('should update and update order if one of the items is ticked', async () => {
      const result = appController.updateGroceries([
        { ...groceries[0], ticked: true },
        ...groceries.slice(1),
      ]);

      expect(result).toStrictEqual([
        { ...groceries[1], order: 0 },
        { ...groceries[2], order: 1 },
        { ...groceries[3], order: 2 },
        { ...groceries[4], order: 3 },
        { ...groceries[5], order: 4 },
        { ...groceries[0], order: 5, ticked: true },
      ]);
    });

    it('should throw an error if update is not an array', async () => {
      try {
        appController.updateGroceries(null);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getResponse()).toStrictEqual({
          status: 400,
          error: 'Request has to be an array',
        });
      }
    });

    it('should throw an error if there are properties missing in an update', async () => {
      try {
        appController.updateGroceries([{ name: 'test' }]);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getResponse()).toStrictEqual({
          status: 400,
          error:
            'Properties are missing, please ensure you provide id, name and ticked properties for all items',
        });
      }
    });

    it('should delete an item and maintain correct order', async () => {
      await appController.deleteItem({ id: 'item-0' });
      expect(appController.getGroceries()).toStrictEqual(
        groceries.slice(1).map((item, index) => ({
          ...item,
          order: index,
        })),
      );

      await appController.deleteItem({ id: 'item-2' });
      expect(appController.getGroceries()).toStrictEqual([
        {
          ...groceries[1],
          order: 0,
        },
        {
          ...groceries[3],
          order: 1,
        },
        {
          ...groceries[4],
          order: 2,
        },
        {
          ...groceries[5],
          order: 3,
        },
      ]);

      await appController.deleteItem({ id: 'item-5' });
      expect(appController.getGroceries()).toStrictEqual([
        {
          ...groceries[1],
          order: 0,
        },
        {
          ...groceries[3],
          order: 1,
        },
        {
          ...groceries[4],
          order: 2,
        },
      ]);
    });
  });
});
