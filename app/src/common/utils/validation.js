export const email = (emailValue) =>
  !!/^[a-z0-9.+_-]+@[a-z0-9_.-]+?\.[a-z0-9]{2,}$/i.exec(emailValue);
export const password = (passwordValue) => !!/^(.){4,256}$/.exec(passwordValue);
export const login = (loginValue) => !!/^[0-9a-zA-Z-_.]{1,128}$/.exec(loginValue);
export const name = (nameValue) => !!/^[a-z0-9._\-\s\u0400-\u04FF]{3,256}$/i.exec(nameValue);

export const minShouldMatch = (minShouldMatchValue) =>
  /^([5-9][0-9])$|^100$/.exec(minShouldMatchValue);
export const minTermFreq = (minTermFreqValue) => /^[1-9]$|^10$/.exec(minTermFreqValue);
export const minDocFreq = (minDocFreqValue) => /^[1-9]$|^10$/.exec(minDocFreqValue);

export const filterName = (value) => value.length >= 3 && value.length <= 128;
export const launchName = (value) => value.length >= 1 && value.length <= 256;
export const launchDescription = (value = '') => value.length >= 0 && value.length <= 1024;
export const dashboardName = (value) => value.length >= 3 && value.length <= 128;
export const widgetName = (value) => value && value.length >= 3 && value.length <= 128;
export const itemNameEntity = (value) => value.length >= 3 && value.length <= 256;
export const launchNumericEntity = (value) =>
  value.length >= 1 && value.length <= 18 && !!value.match(/^[0-9]+$/);
export const launchDescriptionEntity = (value) => value.length >= 3 && value.length <= 18;
export const inRangeValidate = (value, min, max) => Number(value) >= min && Number(value) <= max;
export const attributeKey = (value) => value && value.length >= 1 && value.length <= 128;
export const attributesArray = (value) =>
  !value ||
  !value.length ||
  value.every((attribute) => attributeKey(attribute.value) && !attribute.edited);
export const url = (urlValue) => !!/^(ftp|http|https):\/\/[^ "]+$/.exec(urlValue);
export const issueId = (value) => value.length >= 1 && value.length <= 128;
export const urlPart = (value) => !!/:\/\/.+/.exec(value);
export const projectNumericEntity = (value) => value.length >= 1 && !!value.match(/^[0-9]+$/);
export const defectTypeLongName = (value) => value.length >= 3 && value.length <= 55;
export const defectTypeShortName = (value) => value.length >= 1 && value.length <= 4;
export const projectName = (value) => !!/^[0-9a-zA-Z-_]{3,256}$/.exec(value);
export const btsProject = (value) => value.length >= 1 && value.length <= 55;
export const patternNameLength = (value) => value.length >= 1 && value.length <= 55;
export const patternNameUnique = (newPatternName, patternId, patterns) =>
  !patterns.some(({ id, name: patternName }) => patternName === newPatternName && id !== patternId);
