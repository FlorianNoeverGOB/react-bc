/**
 * Helper class for invoking AL events and making functions accessible in AL.
 */
export default class ALHelper {

    /**
     * Invokes an AL event with the specified event name. Optionally, data can be passed to the event,
     * and the invocation can be skipped if the NAV environment is busy.
     *
     * @param {string} eventName - The name of the AL event to invoke.
     */
    static invokeEvent(eventName: string): void;

    /**
     * Invokes an AL event with the specified event name. Optionally, data can be passed to the event,
     * and the invocation can be skipped if the NAV environment is busy.
     *
     * @param {string} eventName - The name of the AL event to invoke.
     * @param {any[]} [data] - Optional array of arguments to pass to the AL event.
     */
    static invokeEvent(eventName: string, data: any[]): void;

    /**
     * Invokes an AL event with the specified event name. Optionally, data can be passed to the event,
     * and the invocation can be skipped if the NAV environment is busy.
     *
     * @param {string} eventName - The name of the AL event to invoke.
     * @param {any[]} [data] - Optional array of arguments to pass to the AL event.
     * @param {boolean} [skipIfBusy=false] - Optional flag to skip invocation if the NAV environment is busy.
     */
    static invokeEvent(eventName: string, data: any[], skipIfBusy: boolean): void;

    static invokeEvent(eventName: string, data?: any[], skipIfBusy: boolean = false) {
        if (data && data.length != 0) {
            ALHelper.getALMethod(eventName, skipIfBusy)(...data); // Call the AL method with the given name and data
        } else {
            ALHelper.getALMethod(eventName, skipIfBusy)(); // Call the AL method with the given name without data
        }
    }

    /**
     * Retrieves an AL method by name and returns a function that, when invoked, will
     * call the corresponding AL procedure with the provided arguments. If the NAV environment
     * is busy and `SKIP_IF_BUSY` is true, the promise resolves immediately with `SKIP_IF_BUSY`.
     *
     * @private
     * @template T
     * @param {string} name - The name of the AL method to retrieve.
     * @param {T} SKIP_IF_BUSY - A value to resolve the promise with if the NAV environment is busy.
     * @returns {(...args: any[]) => Promise<T | any>} A function that, when invoked, will execute the AL method.
     */
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

    /**
     * Makes a specified function accessible in the AL environment by adding it to
     * the global `window` object with a capitalized name.
     *
     * @param {Function} func - The function to make accessible in AL.
     */
    static makeFunctionAccessible(func: Function) {
        const functionName = func.name; // Get the name of the function
        const capitalizedFunctionName = functionName.charAt(0).toUpperCase() + functionName.slice(1); // Capitalize the first letter of the function name
        (window as any)[capitalizedFunctionName] = func; // Make the function available in the window object to be called in AL
    }
}
