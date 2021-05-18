import { AnyAction } from 'redux';

function logMiddleware() {
  return (next: any) => (action: AnyAction) => {
      return next({ ...action, log: 'logMiddleware' });
  };
}

export { logMiddleware }
