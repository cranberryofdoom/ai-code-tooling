import { ESLintUtils } from '@typescript-eslint/utils';

export const createRule = ESLintUtils.RuleCreator((name) => `https://github.com/scriptdash/eslint-plugin#${name}`);
export default createRule({
  name: 'no-styled-components-import',
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow imports of styled from styled-components',
      category: 'Styled Components',
      recommended: 'error',
    },
    messages: {
      importNative: 'Import styled from styled-components/native instead of styled-components',
    },
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value === 'styled-components') {
          const specifiers = node.specifiers.filter((specifier) => specifier.type !== 'ImportSpecifier' || specifier.imported.name !== 'StyledComponent');
          if (specifiers.length === 0) {
            return;
          }
          context.report({
            node,
            messageId: 'importNative',
            fix: (fixer) => fixer.replaceText(node.source, 'styled-components/native'),
          });
        }
      },
    };
  },
});
