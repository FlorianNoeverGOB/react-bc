# ReactBC
ReactBC is a React template to be integrated in Business Central as a ControlAddIn.
The bundled build result is the javascript source that can be used by BC.

## How to use the template
1. Clone this Repository
2. Open a Terminal in the root of the Project and execute `npm install` (requires NodeJS to be installed).
3. In the Terminal run `npm run start` to run the Project or `npm run build` to just build the Project.
4. The build result is `<projectname>.bundle.js`. You can copy this file into the BC Workspace and use it as a ControlAddIn like you normally would. There is no need for a `startup.js` file.

## How to Call Functions from AL code
The template supports making functions public to be callable from the BC ControlAddIn. For this you need to follow these steps:
1. Import ALHelper class `import ALHelper from 'utils/ALHelper';`
2. Have a function that you want to make accessible for AL Code:
    ```javascript
    function someGlobalFunction() {
        window.alert('Hello from the control add-in!');
    }
    ```
3. Make that function accessible using the `ALHelper` class:
    ```javascript
    ALHelper.makeFunctionAccessible(someGlobalFunction);
    ```
4. In the ControlAddIn of your BC Project, define the Function *(Note that first letter is capital)*:
    ```c#
    controladdin "PTE ReactBC"
    {
        Scripts = './addins/react-bc.bundle.js';

        procedure SomeGlobalFunction();
    }
    ```
5. Call the procedure like you would normally do using the ControlAddIn

## How to call an AL Event from React
The template supports calling Events that are defined in the ControlAddIn file in the BC Project. For this you need to follow these steps:
1. Add the event you want to the ControlAddIn in your BC Project:
    ```c#
    controladdin "PTE ReactBC"
    {
        Scripts = './addins/react-bc.bundle.js';

        event OnControlReady(Message: Text; CurrDateTime: Text);
    }
    ```
2. Invoke the event in the React Project:
    ```javascript
    const datetime = new Date(Date.now());
    ALHelper.invokeEvent('OnControlReady', 'Control Ready Event. Time: ', datetime.toLocaleTimeString());

    // or skipping event if BC Environment is busy (operation is running)
    ALHelper.invokeEventSkipBusy('OnControlReady', 'Control Ready Event. Time: ', datetime.toLocaleTimeString());
    ```
    *Note that the First parameter of the `invokeEvent` function is the name of the Event in your BC Project. All other parameters are the variables you want to call the event in BC with. If you have your data in form of an array just use the spread operator `invokeEvent('name', ...yourarray)`*
