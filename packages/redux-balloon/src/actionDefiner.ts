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

// defApiAction 基于 defPromiseAction 实现
const defApiAction: any = function <Payload, Meta>(
  actDef: ActionDefinerActionDef<Payload, any>,
  isLatest: boolean = true
) {
  const baseMeta = { isApi: true, isLatest }
  let metaCreator = () => baseMeta;
  let curActDef: ActionDefinitionTuple<any, any>;
  if (isActionDefinitionTuple(actDef)) {
    const _metaCreator = actDef[2];
    if (_metaCreator) {
      metaCreator = function (...args) {
        return { ..._metaCreator.apply(_metaCreator, args), ...baseMeta };
      };
    }
    actDef[2] = metaCreator;
    curActDef = actDef;
  } else {
    curActDef = [actDef, identity, metaCreator];
  }
  return defPromiseAction(curActDef);
};

const defPromiseAction: DefPromiseActionFunc = function <Payload, Meta>(
  actDef: ActionDefinerActionDef<Payload, Meta>
) {
  if (isActionDefinitionTuple(actDef)) {
    let [type, payloadCreator, metaCreator] = actDef;
    payloadCreator = payloadCreator != null ? payloadCreator : identity;
    return [type, payloadCreator, createMetaCreator(metaCreator)];
  } else {
    return [actDef, identity, createMetaCreator()];
  }
};

const createMetaCreator = <T>(prevMetaCreator?: MetaCreator<T> | null): any => {
  let meta: MetaOfPromiseAction = { isPromise: true };
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
