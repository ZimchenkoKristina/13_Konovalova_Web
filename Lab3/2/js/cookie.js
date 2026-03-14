/**
 * 
 * @namespace CookieService
 */
const CookieService = {
    /**
     *
     * @param {string} name 
     * @param {any} value - 
     */
    set(name, value) {
        const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))}; expires=${expires}; path=/`;
    },

    /**
     * П
     * @param {string} name 
     * @returns {any|null}
     */
    get(name) {
        const value = document.cookie.split('; ').find(row => row.startsWith(name + '='));
        return value ? JSON.parse(decodeURIComponent(value.split('=')[1])) : null;
    }
};
