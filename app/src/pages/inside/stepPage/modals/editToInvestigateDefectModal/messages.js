import { defineMessages } from 'react-intl';
import { SEARCH_MODES } from './constants';

export const messages = defineMessages({
  ignoreAaTitle: {
    id: 'EditDefectModal.ignoreAaTitle',
    defaultMessage: 'Ignore in Auto Analysis',
  },
  title: {
    id: 'EditDefectModal.title',
    defaultMessage: 'Edit defect type',
  },
  notChangeCommentTitle: {
    id: 'EditDefectModal.notChangeCommentTitle',
    defaultMessage: "Don't change comment",
  },
  replaceCommentsTitle: {
    id: 'EditDefectModal.replaceCommentsTitleShort',
    defaultMessage: 'Replace comments to all selected items',
  },
  addToExistingCommentTitle: {
    id: 'EditDefectModal.addToExistingCommentTitle',
    defaultMessage: 'Add new data to existing comments',
  },
  hotKeyCancelCaption: {
    id: 'EditDefectModal.hotKeyCancelCaption',
    defaultMessage: 'to cancel',
  },
  hotKeySubmitCaption: {
    id: 'EditDefectModal.hotKeySubmitCaption',
    defaultMessage: 'to submit',
  },
  defectTypeTitle: {
    id: 'EditDefectModal.defectTypeTitle',
    defaultMessage: 'Defect type',
  },
  saveAndPostIssueMessage: {
    id: 'EditDefectModal.saveAndPostIssueMessage',
    defaultMessage: 'Save and post issue',
  },
  saveAndLinkIssueMessage: {
    id: 'EditDefectModal.saveAndLinkIssueMessage',
    defaultMessage: 'Save and link issue',
  },
  saveAndUnlinkIssueMessage: {
    id: 'EditDefectModal.saveAndUnlinkIssueMessage',
    defaultMessage: 'Save and unlink issue',
  },
  updateDefectsSuccess: {
    id: 'EditDefectModal.updateDefectsSuccess',
    defaultMessage: 'Defects have been updated',
  },
  updateDefectsFailed: {
    id: 'EditDefectModal.updateDefectsFailed',
    defaultMessage: 'Failed to update defects',
  },
  defectTypeSelectorPlaceholder: {
    id: 'EditDefectModal.defectTypeSelectorPlaceholder',
    defaultMessage: 'Choose defect type',
  },
  defectCommentPlaceholder: {
    id: 'EditDefectModal.defectCommentPlaceholder',
    defaultMessage: 'Leave comment to defect type',
  },
  selectedCount: {
    id: 'EditDefectModal.selectedCount',
    defaultMessage: '{count} items selected',
  },
  noItems: {
    id: 'EditDefectModal.noItems',
    defaultMessage: 'No similar items',
  },
  changeSimilarItems: {
    id: 'EditDefectModal.changeSimilarItems',
    defaultMessage: 'Change Similar Items',
  },
  currentLaunchMode: {
    id: 'EditDefectModal.currentLaunchMode',
    defaultMessage: 'For the current launch ',
  },
  sameLaunchNameMode: {
    id: 'EditDefectModal.sameLaunchNameMode',
    defaultMessage: 'Launches with the same name',
  },
  filterMode: {
    id: 'EditDefectModal.filterMode',
    defaultMessage: 'For the current applied filter',
  },
  [`${SEARCH_MODES.CURRENT_LAUNCH}Tooltip`]: {
    id: 'EditDefectModal.currentLaunchTooltip',
    defaultMessage: 'Test items with similar failure reason in launch {launch}',
  },
  [`${SEARCH_MODES.FILTER}Tooltip`]: {
    id: 'EditDefectModal.filterTooltip',
    defaultMessage: 'Test items with similar failure reason in last 10 launches of Filter {filter}',
  },
  [`${SEARCH_MODES.LAUNCH_NAME}Tooltip`]: {
    id: 'EditDefectModal.launchNameTooltip',
    defaultMessage: 'Test items with similar failure reason in last 10 launches of launch {launch}',
  },
});