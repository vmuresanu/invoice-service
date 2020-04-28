import { handleSorting } from './helpers';

describe('Helpers', () => {
  test('handleSorting should correctly format query params', () => {
    [
      { input: '-title,+description', output: { title: -1, description: 1 } },
      { input: '+title,-description', output: { title: 1, description: -1 } },
    ].forEach(testCase => {
      expect(handleSorting(testCase.input)).toEqual(testCase.output);
    });
  });
});
