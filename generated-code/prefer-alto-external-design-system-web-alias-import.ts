import { ESLintUtils } from '@typescript-eslint/utils';

export const createRule = ESLintUtils.RuleCreator((name) => `https://github.com/scriptdash/eslint-plugin#${name}`);
export default createRule({
  name: 'prefer-alto-external-design-system-web-alias-import',
  meta: {
    type: 'problem',
    docs: {
      description: 'Only use the @alto/external-design-system-web alias for imports',
      category: 'Best Practices',
      recommended: 'error',
    },
    messages: {
      onlyUseExternalDesignSystemWebAliasedImport: 'Only use the @alto/external-design-system-web alias for imports',
    },
    fixable: 'code',
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        const { source } = node;
        const { value } = source;
        if (value.includes('external-design-system-web')) {
          context.report({
            node,
            messageId: 'onlyUseExternalDesignSystemWebAliasedImport',
            fix: (fixer) => fixer.replaceText(source, '@alto/external-design-system-web'),
          });
        }
      },
    };
  },
});
