import React, {
    useState,
    useEffect,
    useMemo,
    memo,
    useRef,
    useCallback,
    useContext,
} from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import TodoList from './Todo'
import './App.css'
import { createContext } from 'react'

function Foo(props) {
    console.log('11111')

    return (
        <div>
            {props.count}
            <button onClick={props.onClickaaa}>aaaaaaa</button>
        </div>
    )
}

const Button = memo(() => {
    console.log('button')
    const {test} = useContext(TrainContext);
    return <div>button{test}</div>
})

function useCountJsx(defaultCount) {
    return <div>adfafdadfa{defaultCount}</div>
}

function useCount(defaultCount) {
    const [count, setCount] = useState(defaultCount)
    const it = useRef()

    useEffect(() => {
        it.current = setInterval(() => {
            setCount((count) => count + 1)
        }, 100)
    }, [])

    useEffect(() => {
        if (count > 8) {
            clearInterval(it.current)
        }
    })

    return [count, setCount]
}

function useSize() {
    const [size, setSize] = useState({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
    })

    const onResize = () => {
        console.log('2222222222')
        setSize({
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
        })
    }
    useEffect(() => {
        // const onResize = () => {
        //   setSize({
        //     width: document.documentElement.clientWidth,
        //     height: document.documentElement.clientHeight,
        //   });
        // };
        console.log('3333333333')
        window.addEventListener('resize', onResize, false)
        return () => {
            window.removeEventListener('resize', onResize, false)
        }
    }, [])

    return size
}
const TrainContext = createContext()

function App() {
    const [count, setCount] = useState(0)
    const [counta, setCounta] = useState(0)
    const [countb] = useCount(0)
    const size = useSize()

    const conuntJsx = useCountJsx(count)
    const counterRef = useRef()
    const it = useRef()

    useEffect(() => {
        document.title = count
    }, [count])
    // useEffect(() => {
    //   it.current = setInterval(() => {
    //     setCount((count) => count + 1);
    //   }, 100);
    // }, []);

    useEffect(() => {
        if (count > 8) {
            clearInterval(it.current)
        }
    })

    const double = useMemo(() => {
        if (count === 3) {
            return count * 2
        }
    }, [count])
    const onFoo = useCallback(() => {
        setCount((count) => count + 1)
        setCounta((count) => count + 1)
    }, [])
    const add = () => {
        console.log(count)
        setCount(count + 1)
    }
    return (
        <div>
            <Router>
                <Route exact path="/todo" component={TodoList} />
            </Router>
            {count}
            size
            <span>{size.width}</span>
            <button onClick={add}>add</button>
            <input ref={counterRef} />
            <p>{countb}</p>
            {double}
            <Foo count={double} />
            <div>{conuntJsx}</div>
            <TrainContext.Provider
                value={{
                    test: "test",
                }}
            >
                <Button>Button</Button>
            </TrainContext.Provider>
        </div>
    )
}

export default App
