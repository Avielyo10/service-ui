import { apiTokenStringSelector } from 'controllers/user';
import { dashboardFullScreenModeSelector } from 'controllers/dashboard';

const authSelector = (state) => state.auth || {};

export const isAuthorizedSelector = (state) => !!authSelector(state).authorized;

const userTokenSelector = (state) => authSelector(state).token;
const tokenTypeSelector = (state) => userTokenSelector(state).type;
const tokenValueSelector = (state) => userTokenSelector(state).value;
const tokenStringSelector = (state) => `${tokenTypeSelector(state)} ${tokenValueSelector(state)}`;

export const tokenSelector = (state) =>
  dashboardFullScreenModeSelector(state)
    ? apiTokenStringSelector(state)
    : tokenStringSelector(state);

export const lastFailedLoginTimeSelector = (state) => authSelector(state).lastFailedLoginTime;
