import balloon from '../src/index';
import { BizStatus } from '../src';
import { helloModel, worldModel } from './helps/model';
import sinon from 'sinon';
import { logMiddleware } from './helps/middelware'

describe('test balloon', () => {
  test('should run model', () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    expect(app.status).toBe(BizStatus.RUNNING);
  });

  test('get state', () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    expect(app.store?.getState().hello.count).toBe(0);
  });

  test('get state by selectors', () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    expect(app.selectors.getCount(app.store?.getState())).toBe(0);
  });

  test('change state', () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    app.store?.dispatch(app.actions.addCount(4));
    expect(app.store?.getState().hello.count).toBe(4);
  });

  test('should dynamic load model', () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    expect(app.store?.getState()).toEqual({ hello: { count: 0, name: 'Jack' } });

    app.model(worldModel);
    expect(app.store?.getState()).toEqual({
      hello: { count: 0, name: 'Jack' },
      world: { status: false }
    });
  });

  test('test getModel api', () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    expect(app.getModel('hello')).toEqual(helloModel);
    expect(app.getModel('hello2')).toEqual(undefined);
  });

  test('should unload model', () => {
    const app = balloon()
    app.model(helloModel);
    app.run();

    expect(() => app.unmodel('a')).toThrow(/don't has this namespace/);
    expect(app.store?.getState()).toEqual({ hello: { count: 0, name: 'Jack' } });
    expect(app.actions).toHaveProperty('addCount');
    expect(app.status).toBe(BizStatus.RUNNING);

    app.unmodel('hello');
    expect(app.actions).not.toHaveProperty('addCount');
    setTimeout(() => {
      // redux 的 replaceReducer 是异步的吗？
      expect(app.store?.getState()).toEqual({});
    }, 1000);
  });

  test('balloon model api should return object that contain model unmodel getModel actions selectors store api', () => {
    const app = balloon();
    app.model(helloModel).model(worldModel);
    app.run();

    expect(app.store?.getState()).toEqual({
      hello: {
        count: 0,
        name: 'Jack'
      },
      world: {
        status: false
      }
    });
    expect(app.actions).toHaveProperty('addCount')
    expect(app.actions).toHaveProperty('changeStatus')
    expect(app.selectors).toHaveProperty('getCount')
    expect(app.selectors).toHaveProperty('getWorldStatus')
  });

  test('balloon run middlewares prop', () => {
    const app = balloon();
    app.model(helloModel);
    app.run({
      middlewares: [logMiddleware]
    })

    const res = app.store?.dispatch(app.actions.addCount(4))
    expect(res.log).toEqual('logMiddleware')
  });

  test('balloon run onSagaError prop', () => {
    const app = balloon();
    app.model(helloModel);
    const onSagaError = sinon.fake()
    app.run({
      onSagaError
    });

    app.store?.dispatch(app.actions.addCountSagaError())
    setTimeout(() => { // onSagaError 是异步的
      expect(onSagaError.callCount).toBe(1)
    }, 1000)
  });
});
