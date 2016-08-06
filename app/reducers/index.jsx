// export var sensorDataReducer = (state = {isFetching: false, data: undefined}, action) => {
//   switch (action.type) {
//     case 'START_SENSOR_DATA_FETCH':
//       return {
//         isFetching: true,
//         data: undefined
//       };
//
//     case 'COMPLETE_SENSOR_DATA_FETCH':
//       return {
//         isFetching: false,
//         data: action.data
//       };
//
//     default:
//       return state;
//   }
// };

// export var nameReducer = (state = 'Anonymous', action) => {
//   switch(action.type) {
//     case 'CHANGE_NAME':
//       return action.name;
//     default:
//       return state;
//   };
// };
//
// var nextHobbyId = 1;
// export var hobbiesReducer = (state = [], action) => {
//   switch(action.hobby) {
//     case 'ADD_HOBBY':
//       return [
//         ...state,
//         {
//           id: nextHobbyId++,
//           hobby: action.hobby
//         }
//       ];
//
//     case 'REMOVE_HOBBY':
//       return state.filter((hobby) => hobby.id !== action.id);
//
//     default:
//       return state;
//   }
// };

//
// export var mapReducer = (state = {isFetching: false, url: undefined}, action) => {
//   switch (action.type) {
//     case 'START_LOCATION_FETCH':
//      return {
//        isFetching: true,
//        url: undefined
//      };
//     case 'COMPLETE_LOCATION_FETCH':
//       return {
//         isFetching: false,
//         url: action.url
//       };
//     default:
//       return state;
//   }
// };
