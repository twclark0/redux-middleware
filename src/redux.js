import { createStore, combineReducers, applyMiddleware } from 'redux'

export const addTodo = todo => ({
  type: 'ADD_TODO',
  todo
})

export const removeTodo = id => ({
  type: 'REMOVE_TODO',
  id
})

const initialState = {
  todos: window.localStorage.getItem('todos') ? JSON.parse(window.localStorage.getItem('todos')) : []
}

const handleNewTodo = (state, action) => ({
  todos: [...state.todos, action.todo]
})

const handleRemoveTodo = (state, action) => ({
  todos: [
    ...state.todos.slice(0, action.id),
    ...state.todos.slice(action.id + 1)
  ]
})

const currentList = (state = initialState, action) => {
  const handlers = {
    REMOVE_TODO: handleRemoveTodo,
    ADD_TODO: handleNewTodo
  }
  return handlers[action.type] ? handlers[action.type](state, action) : state
}

const rootReducer = combineReducers({
  currentList
})

const loggerMiddleware = store => next => action => {
  console.log('action to be dispatched', action)
  next(action)
  console.log('state after action', store.getState())
}

const localStorageMiddleware = store => next => action => {
  next(action)
  const todosJSON = JSON.stringify(store.getState().currentList.todos)
  console.log(todosJSON)
  window.localStorage.setItem('todos', todosJSON)
}

export const store = createStore(rootReducer, applyMiddleware(loggerMiddleware, localStorageMiddleware))