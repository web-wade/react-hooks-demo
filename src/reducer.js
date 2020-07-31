function combineReducers(reducers) {
    return function reducer(state, action) {
        const changed = {};
        for (let key in reducers) {
            changed[key] = reducers[key](state[key], action);
        }
        return {
            ...state,
            ...changed
        };
    };
}
const reducers = {
    todos(state, action) {
        const { type, payload } = action;
        switch (type) {
            case "set":
                return payload;
            case "add":
                return [...state, payload];
            case "remove":
                return state.filter(item => item.id !== payload);

            case "toggle":
                return state.map(todo => {
                    return todo.id === payload
                        ? {
                              ...todo,
                              complete: !todo.complete
                          }
                        : todo;
                });

            default:
                return state;
        }
    },
    incrementCount(state, action) {
        const { type } = action;
        switch (type) {
            case "set":
            case "add":
                return state + 1;
            default:
                return state;
        }
    }
};

export default combineReducers(reducers);
