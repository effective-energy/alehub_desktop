const state = {
    links: [{
        path: '/wallet',
        iconName: 'wallet',
        iconWidth: '23',
        iconHeight: '20.5'
    }, {
        path: '/offers',
        iconName: 'jobs-ic',
        iconWidth: '24.5',
        iconHeight: '22.5'
    }, {
        path: '/notifications',
        iconName: 'notifications-ic',
        iconWidth: '20',
        iconHeight: '22',
        isBadge: true
    }, {
        path: '/settings',
        iconName: 'settings',
        iconWidth: '19',
        iconHeight: '19'
    }]

    // }, {
    // 	path: '/dashboard',
    // 	iconName: 'dashboard',
    // 	iconWidth: '22',
    // 	iconHeight: '18'
    // },

}

const mutations = {}

const getters = {
    navbarGetPlatform: state => {
        let os = '';
        if (navigator.userAgent.indexOf('Windows') != -1) os = 'win32';
        if (navigator.userAgent.indexOf('Linux') != -1) os = 'linux';
        if (navigator.userAgent.indexOf('Mac') != -1) os = 'osx';
        return os;
    }
}

export default {
    state,
    mutations
}