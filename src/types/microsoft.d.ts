declare interface Window {
    Microsoft: {
        Dynamics: {
            NAV: {
                GetEnvironment(): NAVEnvironment;
                InvokeExtensibilityMethod(name: string, arguments: unknown[], skipIfBusy: boolean, successCallback?: () => void, errorCallback?: () => void): void;
            };
        };
    };
    OnInvokeResult?: (result: unknown) => void;
}

interface NAVEnvironment {
    get Busy(): boolean;
}
