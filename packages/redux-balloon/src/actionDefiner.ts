import {
  MetaOfApiAction,
  MetaCreator,
  ActionDefinitionTuple,
  MetaOfPromiseAction,
  DefApiActionFunc,
  DefPromiseActionFunc,
  ActionDefinerActionDef,
  ActionDefiner,
  ApiAction,
  PromiseAction
} from './types/actions';
import { isArray, identity } from './utils';
import { AnyAction } from 'redux';

const defApiAction: DefApiActionFunc = function <Payload, Meta>(
  actDef: ActionDefinerActionDef<Payload, Meta>,
  isLatest: boolean = true
) {
  if (isActionDefinitionTuple(actDef)) {
    const type = actDef[0];
    const payloadCreator = actDef[1] != null ? actDef[1] : identity;
    return [type, payloadCreator, createMetaCreator(actDef[2], isLatest)];
  } else {
    return [actDef, identity, createMetaCreator(null, isLatest)];
  }
};

const defPromiseAction: DefPromiseActionFunc = function <Payload, Meta>(
  actDef: ActionDefinerActionDef<Payload, Meta>
) {
  if (isActionDefinitionTuple(actDef)) {
    const type = actDef[0];
    const payloadCreator = actDef[1] != null ? actDef[1] : identity;
    return [type, payloadCreator, createMetaCreator(actDef[2])];
  } else {
    return [actDef, identity, createMetaCreator()];
  }
};

const createMetaCreator = <T>(
  prevMetaCreator?: MetaCreator<T> | null,
  isLatest?: boolean
): any => {
  const isCreateApiMeta = typeof isLatest === 'boolean';
  let meta: MetaOfApiAction | MetaOfPromiseAction = isCreateApiMeta
    ? { isApi: true, isLatest }
    : { isPromise: true };

  return function (...args: any[]) {
    if (prevMetaCreator) {
      meta = { ...prevMetaCreator.apply(prevMetaCreator, args), ...meta };
    }
    return meta;
  };
};

function isActionDefinitionTuple(o: any): o is ActionDefinitionTuple<any, any> {
  return isArray(o) && o.length >= 1 && o.length <= 3;
}

function isApiAction(action: AnyAction): action is ApiAction<any> {
  return action.meta && action.meta.isApi;
}

function isPromiseAction(action: AnyAction): action is PromiseAction<any> {
  return action.meta && action.meta.isPromise;
}

function isLatestForApiAction(action: ApiAction<any>): boolean {
  return action.meta && action.meta.isApi && action.meta.isLatest === true;
}

function isEveryForApiAction(action: ApiAction<any>): boolean {
  return action.meta && action.meta.isApi && action.meta.isLatest === false;
}

const actionDefiner: ActionDefiner = {
  defApiAction,
  defPromiseAction
};

export {
  actionDefiner,
  isActionDefinitionTuple,
  isApiAction,
  isPromiseAction,
  isLatestForApiAction,
  isEveryForApiAction
};
