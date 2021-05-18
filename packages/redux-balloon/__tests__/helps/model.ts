import { Model } from '../../src';

export const apiMap = {
  async CHANGE_COUNT_API(payload) {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(payload), 3000)
    })
  },
  async CHANGE_COUNT_API_PAYLOAD_CREATOR(payload) {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(payload), 3000)
    })
  },
  async CHANGE_COUNT_API_META_CREATOR(payload) {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(payload), 3000)
    })
  },
  async CHANGE_COUNT_API_PAYLOAD_META_CREATOR(payload) {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(payload), 3000)
    })
  },
  async CHANGE_COUNT_API_NOT_LATEST(payload) {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(payload), 3000)
    })
  },
  async CHANGE_COUNT_API_IS_LATEST(payload) {
    return await new Promise((resolve) => {
      setTimeout(() => resolve(payload), 3000)
    })
  }
}

export const helloModel: Model<
  { count: number; name: string },
  { addCount: (params: number) => void },
  { getCount: (state: { count: number }) => number }
> = {
  namespace: 'hello',
  state: { count: 0, name: 'Jack' },
  reducers: {
    ADD_COUNT: (state, { payload }) => {
      return Object.assign({}, state, { count: state.count + payload });
    },
    CHANGE_COUNT_PROMISE_SUCCESS: (state, { payload }) => {
      return Object.assign({}, state, { count: payload });
    },
    CHANGE_COUNT_API_NOT_LATEST_SUCCESS: (state, { payload }) => {
      return Object.assign({}, state, { count: payload });
    },
    CHANGE_COUNT_API_IS_LATEST_SUCCESS: (state, { payload }) => {
      return Object.assign({}, state, { count: payload });
    },
    CHANGE_COUNT_API_SUCCESS: (state, { payload }) => {
      return Object.assign({}, state, { count: payload });
    },
    CHANGE_COUNT_API_PAYLOAD_CREATOR_SUCCESS: (state, { payload }) => {
      return Object.assign({}, state, { count: payload });
    },
    CHANGE_COUNT_API_META_CREATOR_SUCCESS: (state, { payload }) => {
      return Object.assign({}, state, { count: payload });
    },
    CHANGE_COUNT_API_PAYLOAD_META_CREATOR_SUCCESS: (state, { payload }) => {
      return Object.assign({}, state, { count: payload });
    },
    CHANGE_NAME: (state, { payload }) => {
      return Object.assign({},state, { name: payload })
    }
  },
  actions: ({ defApiAction, defPromiseAction }) => ({
    addCount: 'ADD_COUNT',
    addCountCustomPayloadCreator: ['ADD_COUNT', x => x * 2],
    addCountCustomMetaCreator: ['ADD_COUNT', null, () => ({ admin: true })],
    addCountCustomPayloadAndMetaCreator: [
      'ADD_COUNT',
      x => x * 2,
      () => ({ admin: true })
    ],
    changeCountPromise: defPromiseAction('CHANGE_COUNT_PROMISE'),
    changeCountPromiseCustomPayloadCreator: defPromiseAction([
      'CHANGE_COUNT_PROMISE',
      x => x * 2
    ]),
    changeCountPromiseCustomMetaCreator: defPromiseAction([
      'CHANGE_COUNT_PROMISE',
      null,
      () => ({ admin: true })
    ]),
    changeCountPromiseCustomPayloadAndMetaCreator: defPromiseAction([
      'CHANGE_COUNT_PROMISE',
      x => x * 2,
      () => ({ admin: true })
    ]),
    changeCountApi: defApiAction('CHANGE_COUNT_API'),
    changeCountApiPayloadCreator: defApiAction([
      'CHANGE_COUNT_API_PAYLOAD_CREATOR',
      x => x * 2
    ]),
    changeCountApiCustomMetaCreator: defApiAction([
      'CHANGE_COUNT_API_META_CREATOR',
      null,
      () => ({ admin: true })
    ]),
    changeCountApiCustomPayloadAndMetaCreator: defApiAction([
      'CHANGE_COUNT_API_PAYLOAD_META_CREATOR',
      x => x * 2,
      () => ({ admin: true })
    ]),
    changeCountApiNotLatest: defApiAction('CHANGE_COUNT_API_NOT_LATEST', false),
    changeCountApiIsLatest: defApiAction('CHANGE_COUNT_API_IS_LATEST'),
    addCountSagaError: 'ADD_COUNT_SAGA_ERROR',
    changeName: 'CHANGE_NAME'
  }),
  selectors: ({ createSelector }) => ({
    getCount: state => state.count,
    getCountMemory: createSelector(
      (state: any) => state.count,
      count => {
        return { count: count + 10 }
      }
    )
  }),
  sagas: ({ call, put }) => ({
    *ADD_COUNT_SAGA_ERROR() {
      throw new Error('test onSagaError');
    },
    *CHANGE_COUNT_PROMISE({ _resolve, payload, meta }) {
      yield put({
        type: `CHANGE_COUNT_PROMISE_SUCCESS`,
        payload,
        requestPayload: payload,
        meta
      });
      yield call(_resolve, payload);
    }
  })
};

export const orgModel: Model<
  { list: number[] },
  { changeList: (params: number[]) => void },
  { getList: (state: { list: number[] }) => number[] }
> = {
  namespace: 'org.table',
  state: { list: [1, 2] },
  reducers: {
    CHANGE_LIST: (state, { payload }) => {
      return Object.assign({}, state, { list: payload });
    }
  },
  actions: () => ({
    changeList: ['CHANGE_LIST']
  }),
  selectors: () => ({
    getList: state => state.list
  })
};

export const worldModel: Model<
  { status: boolean },
  { changeStatus: (status: boolean) => void },
  { getWorldStatus: (state: { status: boolean }) => boolean }
> = {
  namespace: 'world',
  state: { status: false },
  reducers: {
    CHANGE_STATUS: (state, { payload }) => {
      return Object.assign({}, state, { status: payload });
    }
  },
  actions: () => ({
    changeStatus: ['CHANGE_STATUS']
  }),
  selectors: () => ({
    getWorldStatus: state => state.status
  })
};

export const testSagasIsFnReturnPlainObjectModel: Model<
  {
    isActive: boolean;
  },
  { changeStatus: (params: boolean) => void },
  any
> = {
  namespace: 'sagas',
  state: { isActive: false },
  actions: () => ({
    changeStatus: 'CHANGE_STATUS'
  }),
  reducers: {
    CHANGE_STATUS_SUCCESS(state, { payload }) {
      return Object.assign({}, state, { isActive: payload });
    }
  },
  selectors: () => ({}),
  sagas: ({ put }) => ({
    *CHANGE_STATUS({ payload }) {
      yield put({
        type: 'CHANGE_STATUS_SUCCESS',
        payload
      });
    }
  })
};

export const testSagasIsFnReturnArrayModel: Model<
  {
    isActive: boolean;
    count: number;
    name: string;
  },
  {
    changeStatus: (isActive: boolean) => void;
    changeNameByRegActionType: (count: number) => void;
    changeCountByRegActionType: (name: string) => void;
    testGetAction: () => void;
    testGetSelector: () => void;
  },
  {
    getCount: (state: {
      isActive: boolean;
      count: number;
      name: string;
    }) => number;
  }
> = {
  namespace: 'sagas',
  state: { isActive: false, count: 0, name: 'Jack' },
  actions: () => ({
    changeStatus: 'CHANGE_STATUS',
    changeNameByRegActionType: 'CHANGE_NAME_REG',
    changeCountByRegActionType: 'CHANGE_COUNT_REG',
    testGetAction: 'TEST_GET_ACTION',
    testGetSelector: 'TEST_GET_SELECTOR'
  }),
  reducers: {
    CHANGE_STATUS_SUCCESS(state, { payload }) {
      return Object.assign({}, state, { isActive: payload });
    },
    CHANGE_NAME_REG_SUCCESS(state, { payload }) {
      return Object.assign({}, state, { name: payload });
    },
    CHANGE_COUNT_REG_SUCCESS(state, { payload }) {
      return Object.assign({}, state, { count: payload });
    }
  },
  selectors: () => ({
    getCount: state => state.count
  }),
  sagas: ({ put, takeEvery, select }, { getAction, getSelector }) => {
    const handleFn = function* ({ type, payload }) {
      yield put({
        type: `${type}_SUCCESS`,
        payload
      });
    };
    return [
      {
        *CHANGE_STATUS({ payload }) {
          yield put({
            type: 'CHANGE_STATUS_SUCCESS',
            payload
          });
        },
        *TEST_GET_ACTION() {
          yield put(getAction('changeStatus')(true));
        },
        *TEST_GET_SELECTOR() {
          const getCount = getSelector('getCount');
          const count = yield select(getCount);
          yield put({
            type: 'CHANGE_COUNT_REG_SUCCESS',
            payload: count + 10
          });
        }
      },
      function* () {
        yield takeEvery(action => /^(\w*)_REG$/.test(action.type), handleFn);
      }
    ];
  }
};

export const testSagasIsFnReturnGeneratorModel: Model<
  {
    isActive: boolean;
  },
  { changeStatus: (params: boolean) => void },
  any
> = {
  namespace: 'sagas',
  state: { isActive: false },
  actions: () => ({
    changeStatus: 'CHANGE_STATUS'
  }),
  reducers: {
    CHANGE_STATUS_SUCCESS(state, { payload }) {
      return Object.assign({}, state, { isActive: payload });
    }
  },
  selectors: () => ({}),
  sagas: ({ takeEvery, put }) => {
    const handleFn = function* ({
      payload
    }: {
      payload: boolean;
      type: string;
    }) {
      yield put({
        type: 'CHANGE_STATUS_SUCCESS',
        payload
      });
    };
    return function* () {
      yield takeEvery('CHANGE_STATUS', handleFn);
    };
  }
};

export const testSagasIsPlainObjectModel: Model<
  {
    isActive: boolean;
  },
  { changeStatus: (params: boolean) => void },
  any
> = {
  namespace: 'sagas',
  state: { isActive: false },
  actions: () => ({
    changeStatus: 'CHANGE_STATUS'
  }),
  reducers: {
    CHANGE_STATUS_SUCCESS(state, { payload }) {
      return Object.assign({}, state, { isActive: payload });
    }
  },
  selectors: () => ({}),
  sagas: {
    *CHANGE_STATUS(action, { put }) {
      yield put({
        type: `${action.type}_SUCCESS`,
        payload: action.payload
      });
    }
  }
};
