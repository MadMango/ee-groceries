import './App.css';
import { defaultTheme, Provider, View, Flex, ListView, Item, Text, useListData, ActionButton, TextField } from '@adobe/react-spectrum';
import CrossMedium from '@spectrum-icons/ui/CrossMedium';
import Add from '@spectrum-icons/workflow/Add';
import Erase from '@spectrum-icons/workflow/Erase';
import { useDragAndDrop } from '@react-spectrum/dnd';
import { useEffect, useState } from 'react';
import * as httpService from './httpService';

const placeholderGroceries = [{ id: 1, name: 'loading...' }, { id: 2, name: '...' }, { id: 3, name: '...' }, { id: 4, name: '...' }, { id: 5, name: '...' }, { id: 6, name: '...' }];

function App () {

  useEffect(() => {
    loadGroceries();
    // a hack to make this run when component first renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [debounce, setDebounce] = useState();
  const [newItemName, setNewItemName] = useState('');
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  const list = useListData({
    initialItems: placeholderGroceries
  });

  const refreshGroceries = (groceries) => {
    list.items.forEach(({ id: key }) => {
      list.remove(key);
    });

    groceries.forEach(({ id, name, ticked, order }) => {
      list.append({ id, name, ticked, order });
    });

    groceries.forEach(({ id, order }) => {
      if (order) {
        list.move(id, order);
      }
    });

    const newSelectedKeys = new Set(groceries.filter(({ ticked }) => ticked).map(({ id }) => id));
    setSelectedKeys(newSelectedKeys);
  };

  const scrollRowIntoView = () => {
    if (debounce) {
      clearTimeout(debounce);
    }
    setDebounce(setTimeout(() => {
      const rows = document.querySelectorAll('[role="row"]');
      rows[rows.length - 1].scrollIntoView({
        behavior: 'smooth'
      });
    }, 250));
  };

  const onSubmitKeyDown = (event) => {
    const { key } = event;
    if (key === 'Enter') {
      addNewItem();
    }
  };

  const addNewItem = async () => {
    try {
      const trimmed = newItemName?.trim();
      if (trimmed && trimmed.length) {
        const groceries = await httpService.addNewItem({ name: trimmed, ticked: false });
        refreshGroceries(groceries);

        scrollRowIntoView();
        setNewItemName('');
      }
    } catch (err) {
      alert(`Error adding item: ${err.message}`);
      console.error('Failed to add item', err.stack);
    }

  };

  const loadGroceries = async () => {
    try {
      const groceries = await httpService.getGroceries();
      refreshGroceries(groceries);
    } catch (err) {
      alert(`Error loading groceries: ${err.message}`);
      console.error('Failed to load groceries', err.stack);
    }
  };

  const resetGroceries = async () => {
    try {
      const groceries = await httpService.resetGroceries();
      refreshGroceries(groceries);
    } catch (err) {
      alert(`Error resetting groceries: ${err.message}`);
      console.error('Failed to reset groceries', err.stack);
    }
  };

  const deleteItem = async (key) => {
    try {
      const groceries = await httpService.deleteItem(key);
      refreshGroceries(groceries);
    } catch (err) {
      alert(`Error deleting item: ${err.message}`);
      console.error('Failed to delete item ', err.stack);
    }
  };

  const updateAllGroceries = async (items) => {
    try {
      const groceries = await httpService.updateAllGroceries(items || list.items);
      refreshGroceries(groceries);
    } catch (err) {
      alert(`Error updating groceries: ${err.message}`);
      console.error('Failed to update groceries ', err.stack);
    }
  };

  const onSelectionChange = async (keys) => {
    const tickedMap = list.items.map(({ id, name, order }) => {
      const ticked = keys.has(id);
      return {
        id, name, ticked, order
      };
    });

    updateAllGroceries(tickedMap);
  };

  const { dragAndDropHooks } = useDragAndDrop({
    getItems (keys) {
      return [...keys].map((key) => {
        const item = list.getItem(key);
        // Setup the drag types and associated info for each dragged item.
        return {
          'custom-app-type-reorder': JSON.stringify(item),
          'text/plain': item.name
        };
      });
    },
    acceptedDragTypes: ['custom-app-type-reorder'],
    onReorder: async (e) => {
      const {
        keys,
        target,
      } = e;

      const itemBeingReordered = list.getItem(Array.from(keys)[0]);

      // dragging multiple items would mean that we're trying to drag selected entries
      if (keys.size > 1) {
        return;
      } else {
        // making sure that we're not dragging a single item that is ticked
        if (itemBeingReordered.ticked) {
          return;
        }
      }

      // target item is the one that the item being ordered goes before or after
      const targetItem = list.getItem(target.key);

      let orderedList = [];
      // ideally, this would be done in the backend as well because now there are two places that control the order of the list
      list.items.forEach((item) => {
        if (item.id === target.key) {
          if (target.dropPosition === 'before') {
            orderedList.push(itemBeingReordered, targetItem);
          } else if (target.dropPosition === 'after') {
            orderedList.push(targetItem, itemBeingReordered);
          }
        } else if (item.id === itemBeingReordered.id) {
          // do nothing
        } else {
          orderedList.push(item);
        }
      });

      orderedList = orderedList.map((item, index) => ({
        ...item,
        order: index,
      }));

      updateAllGroceries(orderedList);
    },
    getAllowedDropOperations: () => ['move']
  });

  return (
    <Provider height='100%' theme={defaultTheme}>
      <View height='100%' backgroundColor='yellow-400'>
        <View height='100%'>
          <Flex height='100%' alignItems="center" justifyContent='space-around' data-testid="groceries-wrapper">
            <Flex rowGap='size-100' height='size-6000' direction='column' alignItems="center">
              <ListView
                aria-label="Reorderable ListView"
                selectionMode="multiple"
                width="size-3600"
                items={list.items}
                dragAndDropHooks={dragAndDropHooks}
                selectedKeys={selectedKeys}
                onSelectionChange={onSelectionChange}
              >
                {(item) => (
                  <Item data-testid="list-item" textValue={item.name}>
                    <Text>{item.name}</Text>
                    <ActionButton aria-label="Icon only" onPress={() => {
                      deleteItem(item.id);
                    }}>
                      <CrossMedium />
                    </ActionButton>
                  </Item>
                )}
              </ListView>
              <Flex alignItems='flex-end' columnGap='size-100' width='size-3600'>
                <TextField
                  data-testid="text-input"
                  flexGrow='1'
                  label="Add a new item"
                  value={newItemName}
                  onChange={setNewItemName}
                  onKeyDown={onSubmitKeyDown}
                />
                <ActionButton data-testid="add-button" aria-label="Icon only" onPress={addNewItem}>
                  <Add />
                </ActionButton>
              </Flex>
              <Flex width='size-3600'>
                <ActionButton flexGrow='1' data-testid="reset-button" onPress={resetGroceries}>
                  Reset Data
                  <Erase />
                </ActionButton>
              </Flex>
            </Flex>
          </Flex>
        </View>
      </View>
    </Provider>
  );
}

export default App;
