import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import { FieldProvider } from 'components/fields/fieldProvider';
import {
  STATS_AB_TOTAL,
  STATS_ND_TOTAL,
  STATS_PB_TOTAL,
  STATS_SI_TOTAL,
  STATS_TI_TOTAL,
} from 'common/constants/statistics';
import { validate } from 'common/utils';
import { ITEMS_INPUT_WIDTH } from './constants';
import { FiltersControl, InputControl } from './controls';

const DEFAULT_ITEMS_COUNT = '50';
const messages = defineMessages({
  ItemsFieldLabel: {
    id: 'FailedCasesTrendControls.ItemsFieldLabel',
    defaultMessage: 'Items',
  },
  ItemsValidationError: {
    id: 'FailedCasesTrendControls.ItemsValidationError',
    defaultMessage: 'Items count should have value from 1 to 600',
  },
});
const validators = {
  items: (formatMessage) => (value) =>
    (!value || !validate.inRangeValidate(value, 1, 600)) &&
    formatMessage(messages.ItemsValidationError),
};

@injectIntl
export class FailedCasesTrendControls extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    widgetSettings: PropTypes.object.isRequired,
    initializeControlsForm: PropTypes.func.isRequired,
    formAppearance: PropTypes.object.isRequired,
    onFormAppearanceChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { widgetSettings, initializeControlsForm } = props;
    initializeControlsForm({
      contentParameters: widgetSettings.contentParameters || {
        contentFields: [
          STATS_PB_TOTAL,
          STATS_AB_TOTAL,
          STATS_SI_TOTAL,
          STATS_ND_TOTAL,
          STATS_TI_TOTAL,
        ],
        widgetOptions: {},
        itemsCount: DEFAULT_ITEMS_COUNT,
      },
    });
  }

  normalizeValue = (value) => value && `${value}`.replace(/\D+/g, '');

  formatFilterValue = (value) => value && value[0];
  parseFilterValue = (value) => value && [value];

  render() {
    const {
      intl: { formatMessage },
      formAppearance,
      onFormAppearanceChange,
    } = this.props;

    return (
      <Fragment>
        <FieldProvider name="filters" parse={this.parseFilterValue} format={this.formatFilterValue}>
          <FiltersControl
            formAppearance={formAppearance}
            onFormAppearanceChange={onFormAppearanceChange}
          />
        </FieldProvider>
        {!formAppearance.isMainControlsLocked && (
          <Fragment>
            <FieldProvider
              name="contentParameters.itemsCount"
              validate={validators.items(formatMessage)}
              format={String}
              normalize={this.normalizeValue}
            >
              <InputControl
                fieldLabel={formatMessage(messages.ItemsFieldLabel)}
                inputWidth={ITEMS_INPUT_WIDTH}
                maxLength="3"
                hintType={'top-right'}
              />
            </FieldProvider>
          </Fragment>
        )}
      </Fragment>
    );
  }
}
