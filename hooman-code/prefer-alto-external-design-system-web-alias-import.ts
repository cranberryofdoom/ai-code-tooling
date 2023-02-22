import { TSESTree } from '@typescript-eslint/utils';
import { createRule } from './util';

/*
  Yells at you for this:
    import { Button } from './external-design-system-web';
    import { Button } from '~web/components/external-design-system-web';
  
  Fixes to this:
    import { Button } from @alto/external-design-system-web;

  AST Example: https://astexplorer.net/#/gist/365e833d45b0a5d99013f7985e7e7492/latest
*/

export default createRule({
  create(context) {
    return {
      'ImportDeclaration > Literal': function (node: TSESTree.Literal): void {
        if (node.value === '@alto/external-design-system-web') return;
        if (node.value && typeof node.value === 'string' && node.value.includes('external-design-system-web')) {
          context.report({
            fix: function (fixer) {
              return fixer.replaceText(node, `'@alto/external-design-system-web'`);
            },
            messageId: 'onlyUseExternalDesignSystemWebAliasedImport',
            node,
          });
        }
      },
    };
  },
  defaultOptions: [],
  meta: {
    docs: {
      description: 'Only use @alto/external-design-system-web as import.',
      recommended: 'error',
    },
    fixable: 'code',
    messages: {
      onlyUseExternalDesignSystemWebAliasedImport: `Don't use the absolute or relative import of external-design-system-web. Import from @alto/external-design-system-web instead.`,
    },
    schema: [],
    type: 'suggestion',
  },
  name: 'prefer-alto-external-design-system-web-alias-import',
});
