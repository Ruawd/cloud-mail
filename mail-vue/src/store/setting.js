import { defineStore } from 'pinia'

export const useSettingStore = defineStore('setting', {
    state: () => ({
        domainList: [],
        settings: {
            r2Domain: '',
            loginOpacity: 1.00,
            loginDarkenFactor: 0,
            linuxdoSwitch: false,
            casdoorSwitch: false,
            casdoorServerUrl: '',
            casdoorClientId: '',
            casdoorCallbackUrl: '',
        },
        lang: '',
    }),
    actions: {

    },
    persist: {
        pick: ['lang'],
    },
})
