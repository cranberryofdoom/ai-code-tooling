import { ESLintUtils } from '@typescript-eslint/utils';
import rule from '../generated-code/prefer-alto-external-design-system-web-alias-import';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('prefer-alto-external-design-system-web-alias-import', rule, {
  invalid: [
    {
      code: `import { Button } from './external-design-system-web';`,
      errors: [{ messageId: 'onlyUseExternalDesignSystemWebAliasedImport' }],
      output: `import { Button } from '@alto/external-design-system-web';`,
    },
    {
      code: `import { Button } from '~web/components/external-design-system-web';`,
      errors: [{ messageId: 'onlyUseExternalDesignSystemWebAliasedImport' }],
      output: `import { Button } from '@alto/external-design-system-web';`,
    },
  ],
  valid: [
    {
      code: `import { Text } from '@alto/external-design-system-web';`,
    },
    {
      code: `import React from 'react';`
    }
  ],
});
