import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ALHelper from './utils/ALHelper';

CreateRootWhenLoaded('controlAddIn');

function someGlobalFunction() {
    window.alert('Hello, from the Control Add-in!');
}

async function CreateRootWhenLoaded(elementId: string) {
    const datetime = new Date(Date.now());
    const root = await waitForElementToExistId(elementId);
    CreateRoot(root as HTMLElement);

    // Makes the function available to be called in AL
    ALHelper.makeFunctionAccessible(someGlobalFunction);

    // Calls the AL event OnControlReady with the given data
    ALHelper.invokeEvent('OnControlReady', 'Control Ready Event. Time: ', datetime.toLocaleTimeString());
}

function waitForElementToExistId(elementId: string) {
    return new Promise((resolve) => {
        function checkElement() {
            const element = document.getElementById(elementId);
            if (element == null) {
                setTimeout(checkElement, 50);
            } else {
                resolve(element);
            }
        }
        checkElement();
    });
}

function CreateRoot(element: HTMLElement) {
    const root = ReactDOM.createRoot(element);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
