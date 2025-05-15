/**
 * Helper class for invoking AL events and making functions accessible in AL.
 */
export default class ALHelper {
    /**
     * Invokes an AL event with the specified event name. Optionally, data can be passed to the event.
     * @param eventName - The name of the AL event to invoke.
     */
    static invokeEvent(eventName: string): void;

    /**
     * Invokes an AL event with the specified event name. Optionally, data can be passed to the event.
     * @param eventName - The name of the AL event to invoke.
     * @param [data] - Optional array of arguments to pass to the AL event.
     */
    static invokeEvent(eventName: string, ...data: unknown[]): void;

    static invokeEvent(eventName: string, ...data: unknown[]): void {
        if (data && data.length != 0) {
            this.getALMethod(eventName, false)(...data); // Call the AL method with the given name and data
        } else {
            this.getALMethod(eventName, false)(); // Call the AL method with the given name without data
        }
    }

    /**
     * Invokes an AL event with the specified event name. Optionally, data can be passed to the event,
     * and the invocation will be skipped if the NAV environment is busy.
     * @param eventName - The name of the AL event to invoke.
     */
    static invokeEventSkipBusy(eventName: string): void;

    /**
     * Invokes an AL event with the specified event name. Optionally, data can be passed to the event,
     * and the invocation will be skipped if the NAV environment is busy.
     * @param eventName - The name of the AL event to invoke.
     * @param [data] - Optional array of arguments to pass to the AL event.
     */
    static invokeEventSkipBusy(eventName: string, ...data: unknown[]): void;

    static invokeEventSkipBusy(eventName: string, ...data: unknown[]): void {
        if (data && data.length != 0) {
            this.getALMethod(eventName, true)(...data); // Call the AL method with the given name and data
        } else {
            this.getALMethod(eventName, true)(); // Call the AL method with the given name without data
        }
    }

    /**
     * Retrieves an AL method by name and returns a function that, when invoked, will
     * call the corresponding AL procedure with the provided arguments. If the NAV environment
     * is busy and `SKIP_IF_BUSY` is true, the promise resolves immediately with `SKIP_IF_BUSY`.
     * @template T
     * @param name - The name of the AL method to retrieve.
     * @param SKIP_IF_BUSY - A value to resolve the promise with if the NAV environment is busy.
     * @returns A function that, when invoked, will execute the AL method.
     */
    private static getALMethod<T>(name: string, SKIP_IF_BUSY: T): (...args: unknown[]) => Promise<T | unknown> {
        const nav = window.Microsoft.Dynamics.NAV.GetEnvironment();

        return (...args: unknown[]): Promise<T | unknown> => {
            let result: unknown;

            // Define the OnInvokeResult event handler
            window.OnInvokeResult = function (alResult: unknown): void {
                result = alResult;
            };

            return new Promise<T | unknown>(resolve => {
                // If nav is busy and skip if busy is true: return
                if (SKIP_IF_BUSY && nav.Busy) {
                    resolve(SKIP_IF_BUSY);
                    return;
                }

                // Invoke the AL method with the given name and arguments
                window.Microsoft.Dynamics.NAV.InvokeExtensibilityMethod(name, args, false, () => {
                    delete window.OnInvokeResult;
                    resolve(result);
                });
            });
        };
    }

    /**
     * Makes a specified function accessible in the AL environment by adding it to
     * the global `window` object with a capitalized name.
     * @param func - The function to make accessible in AL.
     */
    static makeFunctionAccessible(func: (...args: unknown[]) => unknown): void {
        const functionName = func.name; // Get the name of the function
        const capitalizedFunctionName = functionName.charAt(0).toUpperCase() + functionName.slice(1); // Capitalize the first letter of the function name
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)[capitalizedFunctionName] = func; // Make the function available in the window object to be called in AL
    }
}
