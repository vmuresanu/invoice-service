import { handleSorting } from './helpers';
import { InvalidSortingParameterException } from '../shared/exceptions/exceptions';

describe('Helpers', () => {
  // ' ' - because '+' transforms into ' ' at @Query decorator level
  test('handleSorting should correctly format query params', () => {
    [
      { input: '-title, description', output: { title: -1, description: 1 } },
      { input: ' title,-description', output: { title: 1, description: -1 } },
    ].forEach(testCase => {
      expect(handleSorting(testCase.input)).toEqual(testCase.output);
    });
  });

  test('should throw error if sortingParameter is invalid ', () => {
    expect(() => handleSorting( '*title')).toThrow(new InvalidSortingParameterException())
  })
});
