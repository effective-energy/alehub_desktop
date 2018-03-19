const state = {
    reservedBalance: 1000
};

const getters = {
    getReservedBalance: state => {
        return state.reservedBalance;
    }
};

export default {
    state,
    getters
}