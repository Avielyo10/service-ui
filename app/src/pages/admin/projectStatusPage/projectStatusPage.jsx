import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, defineMessages, intlShape } from 'react-intl';
import classNames from 'classnames/bind';
import { ToggleButton } from 'components/buttons/toggleButton';
import { PERIOD_VALUES } from 'common/constants/statusPeriodValues';
import { StatusPageContent } from './statusPageContent';
import styles from './projectStatusPage.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  sixMonths: {
    id: 'ProjectStatusPage.sixMonths',
    defaultMessage: '6 months',
  },
  threeMonths: {
    id: 'ProjectStatusPage.threeMonths',
    defaultMessage: '3 months',
  },
  oneMonth: {
    id: 'ProjectStatusPage.oneMonth',
    defaultMessage: '1 month',
  },
});

@injectIntl
export class ProjectStatusPage extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  };

  state = {
    selectedPeriod: PERIOD_VALUES.THREE_MONTHS,
  };

  onPeriodChange = (selectedPeriod) => this.setState({ selectedPeriod });

  periods = [
    { value: PERIOD_VALUES.SIX_MONTHS, label: this.props.intl.formatMessage(messages.sixMonths) },
    {
      value: PERIOD_VALUES.THREE_MONTHS,
      label: this.props.intl.formatMessage(messages.threeMonths),
    },
    { value: PERIOD_VALUES.ONE_MONTH, label: this.props.intl.formatMessage(messages.oneMonth) },
  ];

  render() {
    return (
      <div className={cx('project-status-page')}>
        <div className={cx('toggle-container')}>
          <ToggleButton
            items={this.periods}
            value={this.state.selectedPeriod}
            separated
            onChange={this.onPeriodChange}
          />
        </div>
        <StatusPageContent interval={this.state.selectedPeriod} projectId={this.props.projectId} />
      </div>
    );
  }
}
