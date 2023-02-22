# ai-code-tooling
A little doohicky that uses GPT3 to try and write your code tooling for you. Provide a prompt and tests, GPT3 does the rest! Currently only supports writing custom lint rules. Will eventually expand to generating codemods and maybe even translating class components to functional components.

## How to Use
1. Run `yarn install`.
2. [Recommended] Set up a VM. We're only really telling GPT3 to generate custom lint rules, but it's best to not run arbitrary generated code directly on your computer. 😛
3. Create an account with OpenAI, grab your secret key, and put it in a `.env` file at root with the contents: `OPENAI_API_KEY=${yourKey}`.
3. Write a test, put it in the `tests` folder.
4. Write a prompt, put it in the `prompts` folder.
5. Run `ts-node ./cli/ai-code-tooling.ts eslint` and follow the instructions!

## Demo
You can find the generated code of this demo in: `./generated-code/prefer-alto-external-design-system-web-alias-import.ts`.

https://user-images.githubusercontent.com/1877652/220542570-b8258fe4-e2d7-4fd1-a369-e30dbbb9e572.mp4

