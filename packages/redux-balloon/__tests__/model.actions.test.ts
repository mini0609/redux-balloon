import balloon from '../src/index';
import { apiMap, helloModel } from './helps/model';
import createApiModel from '../../apiModel';


describe('test model actions', () => {
  test('synchronize action', () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    const res = app.store?.dispatch(app.actions.addCount(4))
    expect(res.payload).toBe(4)
    expect(res).not.toHaveProperty('then')
    expect(app.selectors.getCount(app.store?.getState())).toBe(4);
  });

  test('synchronize action with custom payloadCreator', () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    const res = app.store?.dispatch(app.actions.addCountCustomPayloadCreator(4))
    expect(res.payload).toBe(8)
    expect(res).not.toHaveProperty('then')
    expect(app.selectors.getCount(app.store?.getState())).toBe(8);
  });

  test('synchronize action with custom metaCreator', () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    const res = app.store?.dispatch(app.actions.addCountCustomMetaCreator(4))
    expect(res.payload).toBe(4)
    expect(res.meta.admin).toBeTruthy()
    expect(res).not.toHaveProperty('then')
    expect(app.selectors.getCount(app.store?.getState())).toBe(4);
  });

  test('synchronize action with custom payloadCreator and metaCreator', () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    const res = app.store?.dispatch(app.actions.addCountCustomPayloadAndMetaCreator(4))
    expect(res.payload).toBe(8)
    expect(res.meta.admin).toBeTruthy()
    expect(res).not.toHaveProperty('then')
    expect(app.selectors.getCount(app.store?.getState())).toBe(8);
  });

  test('asynchronous promise action', async () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    const action = app.actions.changeCountPromise(4)
    expect(action.meta.isPromise).toBeTruthy();

    const res = await app.store?.dispatch(action)
    expect(res).toBe(4)
    expect(app.selectors.getCount(app.store?.getState())).toBe(4);
  });

  test('asynchronous promise action custom payloadCreator', async () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    const action = app.actions.changeCountPromiseCustomPayloadCreator(4)
    expect(action.meta.isPromise).toBeTruthy();
    expect(action.payload).toBe(8);

    const res = await app.store?.dispatch(action)
    expect(res).toBe(8)
    expect(app.selectors.getCount(app.store?.getState())).toBe(8);
  });

  test('asynchronous promise action custom metaCreator', async () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    const action = app.actions.changeCountPromiseCustomMetaCreator(4)
    expect(action.meta.isPromise).toBeTruthy();
    expect(action.meta.admin).toBeTruthy();

    const res = await app.store?.dispatch(action)
    expect(res).toBe(4)
    expect(app.selectors.getCount(app.store?.getState())).toBe(4);
  });

  test('asynchronous promise action custom payloadCreator and metaCreator', async () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    const action = app.actions.changeCountPromiseCustomPayloadAndMetaCreator(4)
    expect(action.meta.isPromise).toBeTruthy();
    expect(action.payload).toBe(8);
    expect(action.meta.admin).toBeTruthy();

    const res = await app.store?.dispatch(action)
    expect(res).toBe(8)
    expect(app.selectors.getCount(app.store?.getState())).toBe(8);
  });

  test('asynchronous apiAction action', async () => {
    const app = balloon()
    app.model(helloModel).model(createApiModel({apiMap}));
    app.run();

    const action = app.actions.changeCountApi(4)
    expect(action.meta.isPromise).toBeTruthy();
    expect(action.meta.isApi).toBeTruthy();
    expect(action.meta.isLatest).toBeTruthy();

    const res = await app.store?.dispatch(action)
    expect(res).toBe(4)
    expect(app.selectors.getCount(app.store?.getState())).toBe(4);
  });

  test('asynchronous apiAction action custom payloadCreator', async () => {
    const app = balloon()
    app.model(helloModel).model(createApiModel({apiMap}));
    app.run();

    const action = app.actions.changeCountApiPayloadCreator(4)
    expect(action.meta.isPromise).toBeTruthy();
    expect(action.meta.isApi).toBeTruthy();
    expect(action.meta.isLatest).toBeTruthy();
    expect(action.payload).toBe(8);

    const res = await app.store?.dispatch(action)
    expect(res).toBe(8)
    expect(app.selectors.getCount(app.store?.getState())).toBe(8);
  });

  test('asynchronous apiAction action custom metaCreator', async () => {
    const app = balloon()
    app.model(helloModel).model(createApiModel({apiMap}));
    app.run();

    const action = app.actions.changeCountApiCustomMetaCreator(4)
    expect(action.meta.isPromise).toBeTruthy();
    expect(action.meta.isApi).toBeTruthy();
    expect(action.meta.isLatest).toBeTruthy();
    expect(action.meta.admin).toBeTruthy();

    const res = await app.store?.dispatch(action)
    expect(res).toBe(4)
    expect(app.selectors.getCount(app.store?.getState())).toBe(4);
  });

  test('asynchronous apiAction action custom payloadCreator and metaCreator', async () => {
    const app = balloon()
    app.model(helloModel).model(createApiModel({apiMap}));
    app.run();

    const action = app.actions.changeCountApiCustomPayloadAndMetaCreator(4)
    expect(action.meta.isPromise).toBeTruthy();
    expect(action.meta.admin).toBeTruthy();
    expect(action.meta.isApi).toBeTruthy();
    expect(action.meta.isLatest).toBeTruthy();
    expect(action.payload).toBe(8);

    const res = await app.store?.dispatch(action)
    expect(res).toBe(8)
    expect(app.selectors.getCount(app.store?.getState())).toBe(8);
  });

  // 如何测试 latest 是否生效
  // test('asynchronous apiAction action is latest', async () => {
  //   const app = balloon()
  //   app.model(helloModel).model(createApiModel({apiMap}));
  //   app.run();
  //
  //   const fn = jest.fn()
  //   const action = app.actions.changeCountApiIsLatest({count: 4, cb: fn})
  //   const action2 = app.actions.changeCountApiIsLatest({count: 40, cb: fn})
  //   expect(action.meta.isPromise).toBeTruthy();
  //   expect(action.meta.isApi).toBeTruthy();
  //   expect(action.meta.isLatest).toBeTruthy();
  //
  //   app.store?.dispatch(action)
  //   app.store?.dispatch(action2)
  //   setTimeout(() => {
  //     expect(fn.mock.calls.length).toBe(2)
  //   }, 3000)
  // });

  test('asynchronous apiAction action not latest', async () => {
    const app = balloon()
    app.model(helloModel).model(createApiModel({apiMap}));
    app.run();

    const action = app.actions.changeCountApiNotLatest(4)
    expect(action.meta.isPromise).toBeTruthy();
    expect(action.meta.isApi).toBeTruthy();
    expect(action.meta.isLatest).toBeFalsy();

    const res = await app.store?.dispatch(action)
    expect(res).toBe(4)
    expect(app.selectors.getCount(app.store?.getState())).toBe(4);
  });
});
