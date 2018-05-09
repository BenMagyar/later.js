export default function resolveRoute({ dispatch }, loadData, { match }) {
  const action = loadData(match);
  const { types, promise, ...rest } = action;
  const [ REQUEST, SUCCESS, FAILURE ] = types;
  dispatch({ ...rest, type: REQUEST });

  async function actionPromise(/* pass some fetch client here */) {
    try {
      const result = await promise(/* pass some fetch client here */);
      dispatch({ ...rest, result, type: SUCCESS });
    } catch (error) {
      dispatch({ ...rest, error, type: FAILURE });
    }
  }

  return actionPromise();
}
