import { ESLintUtils } from '@typescript-eslint/utils';
import rule from '../generated-code/no-styled-components-import';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run('no-styled-components-import', rule, {
  invalid: [
    {
      code: "import styled from 'styled-components';",
      errors: [{ messageId: 'importNative' }],
      output: "import styled from 'styled-components/native'",
    },
    {
      code: "import styled, { type StyledComponent } from 'styled-components';",
      errors: [{ messageId: 'importNative' }],
    },
  ],
  valid: [
    {
      code: "import styled from 'styled-components/native';",
    },
    {
      code: "import type { StyledComponent } from 'styled-components';",
    },
    {
      code: "import { type StyledComponent } from 'styled-components';",
    },
  ],
});
