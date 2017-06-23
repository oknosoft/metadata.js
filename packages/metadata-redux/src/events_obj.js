
/**
 * Action Handlers - обработчики событий - вызываются из корневого редюсера
 */
const ACTION_HANDLERS_OBJ = {

	[OBJ_ADD]:          (state, action) => state,

	[OBJ_CHANGE]:       (state, action) => Object.assign({}, state, {obj_change: action.payload}),


};

