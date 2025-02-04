/*
 * Copyright 2017 EPAM Systems
 *
 *
 * This file is part of EPAM Report Portal.
 * https://github.com/reportportal/service-ui
 *
 * Report Portal is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Report Portal is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Report Portal.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as validation from './validation';
import * as asyncValidation from './asyncValidation';

export const validate = validation;
export const validateAsync = asyncValidation;
export { isEmptyObject } from './isEmptyObject';
export { referenceDictionary } from './referenceDictionary';
export { fetch, ERROR_CANCELED, ERROR_UNAUTHORIZED } from './fetch';
export { addTokenToImagePath } from './addTokenToImagePath';
export {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  updateStorageItem,
  getSessionItem,
  setSessionItem,
  updateSessionItem,
} from './storageUtils';
export {
  getTimeUnits,
  getDuration,
  approximateTimeFormat,
  dateFormat,
  fromNowFormat,
  daysFromNow,
  daysBetween,
  utcOffset,
  getTimestampFromMinutes,
  getMinutesFromTimestamp,
  formatDuration,
} from './timeDateUtils';
export { formatValue } from './numberUtils';
export { connectRouter } from './connectRouter';
export { uniqueId } from './uniqueId';
export { fileSizeConverter } from './fileSizeConverter';
export { debounce } from './debounce';
export { arrayRemoveDoubles } from './arrayRemoveDoubles';
export { parseDateTimeRange } from './parseDateTimeRange';
export { getTicketUrlId } from './getTicketUrlId';
export { range } from './range';
export { arrayDiffer } from './arrayDiffer';
export { queueReducers } from './queueReducers';
export { waitForSelector } from './waitForSelector';
export { isEmptyValue } from './isEmptyValue';
export { formatAttribute } from './attributeUtils';
export { omit } from './omit';
