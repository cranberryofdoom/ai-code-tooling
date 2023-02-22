* name of test & file in /generated-code needs to match
* start with only generating custom eslint rules

CLI
1. enter prompt "I want a custom eslint rule that does x." or path to text file in `./prompts`
2. enter relative path to test file you want to test against
3. create prompt based off of user input and test written
4. send to GPT
5. parse result, grab code, save in file that matches name of test in `./generated-code`
6. run `yarn test ./tests/${test_file}`
6. no errors stop
7. if error, grab fail message
8. create prompt based off of fail message
9. repeat steps 4 - 8 until test passes or max 5 tries 
