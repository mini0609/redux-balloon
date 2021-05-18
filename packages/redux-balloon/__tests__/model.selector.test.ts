import balloon from '../src';
import { helloModel } from './helps/model';

describe('selectors', () => {
  test('should return value currently', () => {
    const app = balloon();
    app.model(helloModel);
    app.run();

    const count = app.selectors.getCount(app.store?.getState())
    expect(count).toBe(0);
  })

  test('should return value memory', () => {
    const app = balloon();
    app.model(helloModel);
    app.run();

    const countObj = app.selectors.getCountMemory(app.store?.getState())
    expect(countObj.count).toBe(10);
    
    app.store?.dispatch(app.actions.changeName('Lily'))
    const countObj2 = app.selectors.getCountMemory(app.store?.getState())
    expect(countObj).toEqual(countObj2)
  })
})
