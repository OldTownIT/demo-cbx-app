// eslint-disable-next-line import/prefer-default-export
export const sleep = (() => {
    function _sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function asyncSleep(ms = 500) {
        await _sleep(ms);
    }

    return asyncSleep;
})();
