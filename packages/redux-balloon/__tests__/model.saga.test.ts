import balloon from '../src';
import {
  testSagasIsFnReturnPlainObjectModel,
  testSagasIsFnReturnGeneratorModel,
  testSagasIsFnReturnArrayModel, testSagasIsPlainObjectModel
} from './helps/model';

describe('sagas', () => {
  test('test sagas isFnReturnPlainObject model', () => {
    const app = balloon();
    app.model(testSagasIsFnReturnPlainObjectModel);
    app.run();

    app.store?.dispatch(app.actions.changeStatus(true));
    expect(app.store?.getState().sagas.isActive).toBe(true);
  });

  test('test sagas isFnReturnGenerator model', () => {
    const app = balloon();
    app.model(testSagasIsFnReturnGeneratorModel);
    app.run();

    app.store?.dispatch(app.actions.changeStatus(true));
    expect(app.store?.getState().sagas.isActive).toBe(true);
  });

  test('test sagas isFnReturnArray model', () => {
    const app = balloon();
    app.model(testSagasIsFnReturnArrayModel);
    app.run();

    app.store?.dispatch(app.actions.changeStatus(true));
    expect(app.store?.getState().sagas.isActive).toBe(true);

    app.store?.dispatch(app.actions.changeNameByRegActionType('Lily'));
    expect(app.store?.getState().sagas.name).toBe('Lily');

    app.store?.dispatch(app.actions.changeCountByRegActionType(10));
    expect(app.store?.getState().sagas.count).toBe(10);
  });

  test('test sagas isPlainObjectModel model', () => {
    const app = balloon();
    app.model(testSagasIsPlainObjectModel);
    app.run();

    app.store?.dispatch(app.actions.changeStatus(true));
    expect(app.store?.getState().sagas.isActive).toBe(true);
  });

  test('test sagas use getAction fn', () => {
    const app = balloon();
    app.model(testSagasIsFnReturnArrayModel);
    app.run();

    app.store?.dispatch(app.actions.testGetAction());
    expect(app.store?.getState().sagas.isActive).toBe(true);
  });

  test('test sagas use getSelector fn', () => {
    const app = balloon();
    app.model(testSagasIsFnReturnArrayModel);
    app.run();

    app.store?.dispatch(app.actions.testGetSelector());
    expect(app.store?.getState().sagas.count).toBe(10);
  });

  // 还需要增加 getAction getSelector 两个参数的情况
});
