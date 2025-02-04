import { redirect } from 'redux-first-router';
import {
  fetchDataAction,
  fetchSuccessAction,
  bulkFetchDataAction,
  createFetchPredicate,
} from 'controllers/fetch';
import { put, select, all, takeEvery, take, call } from 'redux-saga/effects';
import {
  testItemIdsArraySelector,
  launchIdSelector,
  pagePropertiesSelector,
  payloadSelector,
  TEST_ITEM_PAGE,
  pathnameChangedSelector,
  PROJECT_LOG_PAGE,
  filterIdSelector,
  updatePagePropertiesAction,
} from 'controllers/pages';
import { PAGE_KEY } from 'controllers/pagination';
import { URLS } from 'common/urls';
import { createNamespacedQuery, mergeNamespacedQuery } from 'common/utils/routingUtils';
import { activeProjectSelector } from 'controllers/user';
import { LEVEL_NOT_FOUND } from 'common/constants/launchLevels';
import { setLevelAction, setPageLoadingAction } from './actionCreators';
import {
  FETCH_TEST_ITEMS,
  NAMESPACE,
  PARENT_ITEMS_NAMESPACE,
  RESTORE_PATH,
  FETCH_TEST_ITEMS_LOG_PAGE,
} from './constants';
import { LEVELS } from './levels';
import {
  namespaceSelector,
  parentItemSelector,
  queryParametersSelector,
  isLostLaunchSelector,
  createParentItemsSelector,
  itemsSelector,
  logPageOffsetSelector,
  levelSelector,
} from './selectors';
import { calculateLevel } from './utils';

function* updateLaunchId(launchId) {
  const payload = yield select(payloadSelector);
  const query = yield select(pagePropertiesSelector);
  const testItemIdsArray = yield select(testItemIdsArraySelector);
  yield put({
    type: TEST_ITEM_PAGE,
    payload: {
      ...payload,
      testItemIds: [launchId, ...testItemIdsArray.slice(1)].join('/'),
    },
    meta: { query },
  });
}

function* restorePath() {
  const parentItem = yield select(parentItemSelector);
  if (!parentItem) {
    return;
  }
  yield call(updateLaunchId, parentItem.launchId);
}

export function* fetchParentItems() {
  const itemIds = yield select(testItemIdsArraySelector);
  const project = yield select(activeProjectSelector);
  const urls = itemIds.map(
    (id, i) => (i === 0 ? URLS.launch(project, id) : URLS.testItem(project, id)),
  );
  yield put(bulkFetchDataAction(PARENT_ITEMS_NAMESPACE, true)(urls));
  yield take(createFetchPredicate(PARENT_ITEMS_NAMESPACE));
}

function* fetchTestItems({ payload = {} }) {
  const { offset = 0 } = payload;
  const isPathNameChanged = yield select(pathnameChangedSelector);
  if (isPathNameChanged && !payload.offset) {
    yield put(setPageLoadingAction(true));
    yield call(fetchParentItems);
  }
  const itemIdsArray = yield select(testItemIdsArraySelector);
  const itemIds = offset ? itemIdsArray.slice(0, itemIdsArray.length - offset) : itemIdsArray;
  let launchId = yield select(launchIdSelector);
  const isLostLaunch = yield select(isLostLaunchSelector);
  let parentId;
  if (isLostLaunch) {
    let parentItem;
    try {
      parentItem = yield select(createParentItemsSelector(offset));
    } catch (e) {} // eslint-disable-line no-empty
    launchId = parentItem ? parentItem.launchId : launchId;
  }

  if (itemIds.length > 1) {
    parentId = itemIds[itemIds.length - 1];
  }
  const project = yield select(activeProjectSelector);
  const namespace = yield select(namespaceSelector, offset);
  const query = yield select(queryParametersSelector, namespace);
  const pageQuery = yield select(pagePropertiesSelector);
  const uniqueIdFilterKey = 'filter.eq.uniqueId';
  const noChildFilter = 'filter.eq.hasChildren' in query;
  const underPathItemsIds = itemIds.filter((item) => item !== launchId);
  yield put(
    fetchDataAction(NAMESPACE)(URLS.testItems(project), {
      params: {
        'filter.eq.launchId': launchId,
        'filter.eq.parentId': !noChildFilter ? parentId : undefined,
        'filter.level.path': !parentId && !noChildFilter ? 1 : undefined,
        'filter.under.path':
          noChildFilter && underPathItemsIds.length > 0 ? underPathItemsIds.join('.') : undefined,
        [uniqueIdFilterKey]: pageQuery[uniqueIdFilterKey],
        ...query,
      },
    }),
  );
  const dataPayload = yield take(createFetchPredicate(NAMESPACE));
  let level;
  if (dataPayload.error) {
    level = LEVEL_NOT_FOUND;
  } else {
    const previousLevel = yield select(levelSelector);
    level = calculateLevel(dataPayload.payload.content, previousLevel);
  }

  if (LEVELS[level]) {
    yield put(fetchSuccessAction(LEVELS[level].namespace, dataPayload.payload));
  }
  yield put(setLevelAction(level));
  yield put(setPageLoadingAction(false));
}

function* watchRestorePath() {
  yield takeEvery(RESTORE_PATH, restorePath);
}

function* watchFetchTestItems() {
  yield takeEvery(FETCH_TEST_ITEMS, fetchTestItems);
}

function* updateStepPagination({ next = false, offset = 1 }) {
  const namespace = yield select(namespaceSelector, offset);
  const namespaceQuery = yield select(queryParametersSelector, namespace);
  let page = parseInt(namespaceQuery[PAGE_KEY], 10) - 1;
  if (next) {
    page = parseInt(namespaceQuery[PAGE_KEY], 10) + 1;
  }
  yield put(
    updatePagePropertiesAction(
      createNamespacedQuery(
        mergeNamespacedQuery(
          namespaceQuery,
          {
            [PAGE_KEY]: page,
          },
          namespace,
        ),
        namespace,
      ),
    ),
  );
}

export function* fetchTestItemsFromLogPage({ payload = {} }) {
  const { next = false } = payload;
  const offset = yield select(logPageOffsetSelector);
  yield call(updateStepPagination, { next, offset });
  yield call(fetchTestItems, { payload: { offset } });
  const testItems = yield select(itemsSelector);
  const projectId = yield select(activeProjectSelector);
  const testItem = next ? testItems[0] : testItems[testItems.length - 1];
  const { launchId, path } = testItem;
  const testItemIds = [launchId, ...path.split('.')].join('/');
  const filterId = yield select(filterIdSelector);
  const namespace = yield select(namespaceSelector, offset);
  const namespaceQuery = yield select(queryParametersSelector, namespace);
  const query = createNamespacedQuery(namespaceQuery, namespace);
  const link = {
    type: PROJECT_LOG_PAGE,
    payload: {
      filterId,
      projectId,
      testItemIds,
    },
    query,
  };
  yield put(redirect(link));
}

function* watchTestItemsFromLogPage() {
  yield takeEvery(FETCH_TEST_ITEMS_LOG_PAGE, fetchTestItemsFromLogPage);
}

export function* testItemsSagas() {
  yield all([watchFetchTestItems(), watchRestorePath(), watchTestItemsFromLogPage()]);
}
