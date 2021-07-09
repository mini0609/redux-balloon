import { ActionCreator } from 'redux';
import { ActionFunctionAny, ActionMeta, Action } from 'redux-actions';
import { NonNullableAndRequiredProperties } from './utils';
import { Model } from './model';

export type { Action, ActionMeta, ActionCreator };

export type PayloadCreator<Payload> = ActionFunctionAny<Payload>;

export type MetaCreator<Meta> = ActionFunctionAny<Meta>;

export type ActionDefinitionTuple<Payload, Meta> = [
  string,
  (PayloadCreator<Payload> | null | undefined)?,
  (MetaCreator<Meta> | null | undefined)?
];

export interface MetaOfApiAction {
  isApi: true;
  isLatest?: boolean;
}

export type PayLoadOfAction<Action extends { payload: any }> =
  Action['payload'];

export type MetaOfAction<Action extends { meta: any }> = Action['meta'];

export interface MetaOfPromiseAction {
  isPromise: true;
}

export type ActionDefinerActionDef<Payload, Meta> = string | ActionDefinitionTuple<Payload, Meta>
export type DefApiActionFunc = <Payload, Meta>(
  actDef: ActionDefinerActionDef<Payload, Meta>,
  isLatest?: boolean
) => NonNullableAndRequiredProperties<
  ActionDefinitionTuple<Payload, Meta & MetaOfApiAction & MetaOfPromiseAction>
>;

export type DefPromiseActionFunc = <Payload, Meta>(
  actDef: ActionDefinerActionDef<Payload, Meta>
) => NonNullableAndRequiredProperties<
  ActionDefinitionTuple<Payload, MetaOfPromiseAction>
>;

export interface ActionDefiner {
  defApiAction: DefApiActionFunc;
  defPromiseAction: DefPromiseActionFunc;
}

export type ActionCreatorsMapObject = {
  [key: string]: (...args: any[]) => any;
};

export type ActionsDefinitionMapObject<
  Actions extends ActionCreatorsMapObject
> = {
  [P in keyof Actions]: string | ActionDefinitionTuple<any, any>;
};

export type ActionsDefinition<Actions extends ActionCreatorsMapObject> = (
  actionDefiner: ActionDefiner
) => ActionsDefinitionMapObject<Actions>;

export type ActionsDefinitionReturnType<M> = M extends {
  actions?: ActionsDefinition<infer S>;
}
  ? S
  : never;

export type ActionKey<M> = keyof ActionsDefinitionReturnType<M>;

export type ActionFuncType<M extends Model, K extends ActionKey<M>> =
  ActionsDefinitionReturnType<M>[K];

type GetActionByModel = <M extends Model, K extends ActionKey<M>>(
  model: M,
  key: K
) => ActionFuncType<M, K>;

type GetAction = (key: string) => (...args: any[]) => any;

export type GetActionFunc = GetActionByModel & GetAction;

export type PromiseAction<Payload> = ActionMeta<Payload, MetaOfPromiseAction>;

export type ApiAction<Payload> = ActionMeta<Payload, MetaOfApiAction>;
