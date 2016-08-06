// string

export var sensorDataReducer = (state = {isFetching: false, data: undefined}, action) => {
  switch (action.type) {
    case 'START_SENSOR_DATA_FETCH':
      return {
        isFetching: true,
        data: undefined
      };

    case 'COMPLETE_SENSOR_DATA_FETCH':
      return {
        isFetching: false,
        data: action.data
      };

    default:
      return state;
  }
};

export var authReducer = (state = {}, action) => {
  switch(action.type) {
    case 'LOGIN':
      return {
        uid: action.uid
      }
    case 'LOGOUT':
      return {};
    default:
      return state;
  }
};

// export var searchTextReducer = (state = '', action) => {
//   switch(action.type) {
//     case 'SET_SEARCH_TEXT':
//       return action.searchText;
//     default:
//       return state;
//   };
// };
//
// // boolean
//
// export var showCompletedReducer = (state = false, action) => {
//   switch(action.type) {
//     case 'TOGGLE_SHOW_COMPLETED':
//       return !state;
//     default:
//       return state;
//   };
// };
//
// // array
//
// export var todosReducer = (state = [], action) => {
//   switch(action.type) {
//     case 'ADD_TODO':
//       return [
//         ...state,
//         action.todo
//       ];
//     case 'TOGGLE_TODO':
//       return state.map((todo) => {
//         if(todo.id === action.id) {
//           var nextCompleted = !todo.completed;
//
//           return  {
//             ...todo,
//             completed: nextCompleted,
//             completedAt: nextCompleted ? moment().unix() : undefined
//           };
//         }
//       });
//     default:
//       return state;
//   };
// };
