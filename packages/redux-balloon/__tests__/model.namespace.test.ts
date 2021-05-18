import balloon from '../src/index';
import { helloModel, orgModel } from './helps/model'

describe('namespace', () => {
  const app = balloon();
  app.model(helloModel).model(orgModel);
  app.run();

  const {
    store,
    actions: { addCount, changeList },
    selectors: { getCount, getList }
  } = app;

  test('get state', () => {
    expect(store?.getState()).toEqual({
      hello: {
        count: 0,
        name: 'Jack'
      },
      org: {
        table: {
          list: [1, 2]
        }
      }
    });
  });

  test('get state by selectors', () => {
    expect(getCount(store?.getState())).toBe(0);
    expect(getList(store?.getState())).toEqual([1, 2]);
  });

  test('change helloModel state', () => {
    store?.dispatch(addCount(4));
    expect(store?.getState().hello.count).toBe(4);
    expect(getCount(store?.getState())).toBe(4);
  });

  test('change orgTableModel state', () => {
    store?.dispatch(changeList([]));
    expect(store?.getState().org.table.list).toEqual([]);
    expect(getList(store?.getState())).toEqual([]);
  });
});
