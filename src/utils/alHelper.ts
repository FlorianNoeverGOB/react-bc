export default class ALHelper {

    static invokeEvent(eventName: string): void;
    static invokeEvent(eventName: string, data: any[]): void;
    static invokeEvent(eventName: string, data: any[], skipIfBusy: boolean): void;

    static invokeEvent(eventName: string, data?: any[], skipIfBusy: boolean = false) {
        if (data && data.length != 0) {
            ALHelper.getALMethod(eventName, skipIfBusy)(...data); // Call the AL method with the given name and data
        } else {
            ALHelper.getALMethod(eventName, skipIfBusy)(); // Call the AL method with the given name without data
        }
    }

    private static getALMethod<T>(name: string, SKIP_IF_BUSY: T): (...args: any[]) => Promise<T | any> {
        const nav = (window as any).Microsoft.Dynamics.NAV.GetEnvironment(); // Get the NAV environment

        return (...args: any[]): Promise<T | any> => {
            let result: any;

            // Define the OnInvokeResult event handler
            (window as any)["OnInvokeResult"] = function (alResult: any) {
                result = alResult;
            }

            return new Promise<T | any>(resolve => {
                // If nav is busy and skip if busy is true: return SKIP_IF_BUSY
                if (SKIP_IF_BUSY && nav.Busy) {
                    resolve(SKIP_IF_BUSY);
                    return;
                }

                // Invoke the AL method with the given name and arguments
                (window as any).Microsoft.Dynamics.NAV.InvokeExtensibilityMethod(name, args, false, () => {
                    delete (window as any).OnInvokeResult;
                    resolve(result);
                });
            });
        }
    }

    static makeFunctionAccessible(func: Function) {
        const functionName = func.name; // Get the name of the function
        const capitalizedFunctionName = functionName.charAt(0).toUpperCase() + functionName.slice(1); // Capitalize the first letter of the function name
        (window as any)[capitalizedFunctionName] = func; // Make the function available in the window object to be called in AL
    }
}
