import { ref, reactive } from 'vue'

import { debounce, throttle } from 'lodash-es'


export function useButton(fn, options = {}) {

    const {
        wait = 500,
        leading = true,
        trailing = false,
        ...opts
    } = options;

    const loading = ref(false);

    async function wrapFn(...args) {
        loading.value = true;

        try {
           await fn(...args)
        } catch (error) {
            console.warn('useButton Error--', error)
        }

        loading.value = false;
    }

    // [wait=0] (number): The number of milliseconds to delay.
    // [options={}] (Object): The options object.
    // [options.leading=false] (boolean): Specify invoking on the leading edge of the timeout.
    // [options.maxWait] (number): The maximum time func is allowed to be delayed before it's invoked.
    // [options.trailing=true] (boolean): Specify invoking on the trailing edge of the timeout.
    const dbFn = debounce(wrapFn, wait, opts);

    // [wait=0] (number): The number of milliseconds to throttle invocations to.
    // [options={}] (Object): The options object.
    // [options.leading=true] (boolean): Specify invoking on the leading edge of the timeout.
    // [options.trailing=true] (boolean): Specify invoking on the trailing edge of the timeout.
    const ttFn = throttle(wrapFn, wait, opts);

    return {
        loading,
        dbFn,
        ttFn,
    }
}