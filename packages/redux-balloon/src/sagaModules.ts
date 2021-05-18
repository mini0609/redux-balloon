import { AnyAction } from 'redux';
import { createSagaMiddleware, ReduxSaga } from './sagaImports';
import SagaError from './SagaError';
import {
  assoc,
  dissoc,
  forEachObjIndexed,
  isFunction,
  isArray,
  getTypeOfCancelSaga,
  noop
} from './utils';
import {
  Saga,
  SagasDefinition,
  SagaHelperFuncOptions,
  StringIndexObject,
  SimpleSagaFunc
} from './index';

const sagaEffects = ReduxSaga.effects;

function addSagaModule(
  model: any,
  existingModules: StringIndexObject
): StringIndexObject {
  const { namespace } = model;
  const sagas = model.workflow || model.sagas;
  if (typeof sagas === 'undefined') {
    return existingModules;
  }

  return assoc(namespace, [sagas], existingModules);
}

function delSagaModule(
  namespace: string,
  existingModules: StringIndexObject
): StringIndexObject {
  return dissoc(namespace, existingModules);
}

function runSagaModules(
  modules: StringIndexObject,
  runSaga: any,
  opts: any,
  extras: any
): void {
  const { onSagaError = noop } = opts;
  const _extras = { ...extras, ReduxSaga };

  forEachObjIndexed((mod, namespace) => {
    const sagas = mod[0];
    const saga = createSaga(sagas, namespace, _extras);
    runSaga(saga)
      .toPromise()
      .catch((err: Error) => {
        if (!(err instanceof SagaError)) {
          err = new SagaError(err, { namespace });
        }
        onSagaError(err);
      });
  }, modules);
}

function createSaga(
  sagas: SagasDefinition,
  namespace: string,
  extras: any
): () => Generator<any> {
  const { fork, take, cancel } = sagaEffects;

  return function* () {
    const tasks: any = [];
    const watchers = createWatchers(sagas, namespace, extras);
    for (let i = 0; i < watchers.length; i++) {
      tasks.push(yield fork(watchers[i]));
    }
    yield take(getTypeOfCancelSaga(namespace));
    yield cancel(tasks);
  };
}

function createWatchers(
  sagas: SagasDefinition,
  namespace: string,
  extras: any
): any[] {
  let sagasVal: any;
  let needInject: boolean = true;

  if (isFunction(sagas)) {
    sagasVal = sagas(sagaEffects, extras);
    if (isFunction(sagasVal)) {
      return [sagasVal];
    } else {
      sagasVal = [].concat(...[sagasVal]);
      needInject = false;
    }
  } else {
    sagasVal = [sagas];
  }

  const watchers: SimpleSagaFunc[] = [];
  for (let i = 0; i < sagasVal.length; i++) {
    const _sagaVal = sagasVal[i];
    if (isFunction(_sagaVal)) {
      watchers.push(_sagaVal);
    } else {
      const watcher = function* () {
        const typeWhiteList = [
          'takeEvery',
          'takeLatest',
          'takeLeading',
          'throttle',
          'debounce'
        ];
        const keys = Object.keys(_sagaVal);

        for (const key of keys) {
          const pattern: string | Function = key;
          let type = 'takeEvery'; // "takeEvery" is default.
          let saga = _sagaVal[key];
          let opts: SagaHelperFuncOptions;

          if (isArray(saga)) {
            saga = _sagaVal[key][0];
            opts = _sagaVal[key][1];
            type = opts.type;

            if (!typeWhiteList.includes(type)) {
              throw new Error(
                `only support these types: [${typeWhiteList}], but got: ${type}. namespace: ${namespace}, key: ${key}`
              );
            }
          }

          const handler = handleActionForHelper(
            saga,
            { namespace, key, needInject },
            extras
          );

          switch (type) {
            case 'throttle':
            case 'debounce':
              yield (sagaEffects as any)[type](opts!.ms, pattern, handler);
              break;
            default:
              // takeEvery, takeLatest, takeLeading.
              yield (sagaEffects as any)[type](pattern, handler);
          }
        }
      };
      watchers.push(watcher);
    }
  }
  return watchers;
}

function handleActionForHelper(
  saga: Saga,
  { namespace, key, needInject }: any,
  extras: any
): Saga {
  const { call } = sagaEffects;
  const injections = needInject ? [sagaEffects, extras] : [];

  return function* (action: AnyAction) {
    try {
      const ret = yield call(saga, action, ...injections);
      const { _resolve } = action;
      if (typeof _resolve === 'function') {
        _resolve(ret);
      }
    } catch (err) {
      const { _reject } = action;
      if (typeof _reject === 'function') {
        _reject(err);
      }
      throw new SagaError(err, { namespace, key });
    }
  };
}

export { addSagaModule, delSagaModule, createSagaMiddleware, runSagaModules };
