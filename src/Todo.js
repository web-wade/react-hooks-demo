import React, { useState, useRef, useEffect } from "react";
import { createSet, createAdd, createRemove } from "./actions";
import reducer from "./reducer";
let idSeq = Date.now();

function bindActionCreators(actionCreators, dispatch) {
    const ret = {};
    for (let key in actionCreators) {
        ret[key] = function(...args) {
            const actionCreator = actionCreators[key];
            const action = actionCreator(...args);
            dispatch(action);
        };
    }

    return ret;
}

function Control(props) {
    const { addTodo } = props;
    const inputRef = useRef();
    const onSubmit = e => {
        e.preventDefault();
        const newText = inputRef.current.value.trim();
        if (newText.length === 0) {
            return;
        }
        addTodo({
            id: ++idSeq,
            text: newText,
            complete: false
        });
        inputRef.current.value = "";
    };
    return (
        <div>
            <h1>Todos</h1>
            <form onSubmit={onSubmit}>
                <input type="text" ref={inputRef} />
            </form>
        </div>
    );
}

function Todos(props) {
    const { todos, dispatch } = props;
    return (
        <ul>
            {todos.map(todo => {
                return (
                    <TodoItem key={todo.id} todo={todo} dispatch={dispatch} />
                );
            })}
        </ul>
    );
}

function TodoItem(props) {
    const {
        todo: { id, text, complete },
        dispatch
    } = props;
    const onChange = () => {
        dispatch({ type: "toggle", payload: id });
    };
    const onRemove = () => {
        dispatch(createRemove(id));
    };

    return (
        <li>
            <input type="checkbox" onChange={onChange} checked={complete} />
            <label className={complete ? "complete" : ""}>{text}</label>
            <button onClick={onRemove}>x</button>
        </li>
    );
}

const LS_KEY = "$-todos";

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [incrementCount, setIncrementCount] = useState(0);
    // const addTodo = todo => {
    //     setTodos(todos => [...todos, todo]);
    // };
    // const removeTodo = id => {
    //     setTodos(todos => todos.filter(item => item.id !== id));
    // };

    // const toggleTodo = id => {
    //     setTodos(todos =>
    //         todos.map(todo => {
    //             return todo.id === id
    //                 ? {
    //                       ...todo,
    //                       complete: !todo.complete
    //                   }
    //                 : todo;
    //         })
    //     );
    // };

    // function reducer(state, action) {
    //     const { type, payload } = action;
    //     switch (type) {
    //         case "set":
    //             return {
    //                 ...state,
    //                 todos: payload
    //             };
    //         case "add":
    //             return {
    //                 ...state,
    //                 todos: [...state.todos, payload],
    //                 incrementCount: incrementCount + 1
    //             };

    //         case "remove":
    //             return {
    //                 ...state,
    //                 todos: todos => todos.filter(item => item.id !== payload)
    //             };

    //         case "toggle":
    //             return {
    //                 ...state,
    //                 todos: todos.map(todo => {
    //                     return todo.id === payload
    //                         ? {
    //                               ...todo,
    //                               complete: !todo.complete
    //                           }
    //                         : todo;
    //                 })
    //             };

    //         default:
    //             return state;
    //     }
    // }
    let store = {
        todos,
        incrementCount
    };

    const dispatch = action => {
        Object.assign(store, {
            todos,
            incrementCount
        });
        const setter = {
            todos: setTodos,
            incrementCount: setIncrementCount
        };
        const newState = reducer(store, action);
        for (let key in newState) {
            setter[key](newState[key]);
        }
    };

    // const dispatch = action => {
    //     const { type, payload } = action;
    //     switch (type) {
    //         case "set":
    //             setTodos(payload);
    //             setIncrementCount(c => c + 1);
    //             break;
    //         case "add":
    //             setTodos(todos => [...todos, payload]);
    //             setIncrementCount(c => c + 1);
    //             break;
    //         case "remove":
    //             setTodos(todos => todos.filter(item => item.id !== payload));
    //             break;
    //         case "toggle":
    //             setTodos(todos =>
    //                 todos.map(todo => {
    //                     return todo.id === payload
    //                         ? {
    //                               ...todo,
    //                               complete: !todo.complete
    //                           }
    //                         : todo;
    //                 })
    //             );
    //             break;

    //         default:
    //             break;
    //     }
    // };

    useEffect(() => {
        const createSetTest = bindActionCreators(
            { createSetTest: createSet },
            dispatch
        ).createSetTest;
        createSetTest(JSON.parse(localStorage.getItem(LS_KEY)) || []);
    }, []);

    useEffect(() => {
        localStorage.setItem(LS_KEY, JSON.stringify(todos));
    }, [todos]);

    return (
        <div className="todo-list">
            <div>{incrementCount}</div>
            <Control
                {...bindActionCreators({ addTodo: createAdd }, dispatch)}
            />
            <Todos todos={todos} dispatch={dispatch} />
        </div>
    );
}
export default TodoList;
