import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { defineMessages, injectIntl } from 'react-intl';
import { LaunchExecutionAndIssueStatistics } from 'components/widgets/charts/launchExecutionAndIssueStatistics';
import { omit } from 'common/utils/omit';
import { NoDataAvailable } from 'components/widgets/noDataAvailable';
import styles from './lastLaunch.scss';

const cx = classNames.bind(styles);

const messages = defineMessages({
  noDataMessage: {
    id: 'LastLaunch.noDataMessage',
    defaultMessage: 'No launches were performed',
  },
});

@injectIntl
export class LastLaunch extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    intl: PropTypes.object.isRequired,
  };

  state = {
    isContainerRefReady: false,
  };

  componentDidMount() {
    if (this.containerRef.current) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ isContainerRefReady: true });
    }
  }

  getStatisticsData = (statistics) => {
    const { executions, defects } = statistics;

    const executionsMapped = {};
    const contentFieldsExec = Object.keys(executions).map((key) => {
      const newKey = `statistics$executions$${key}`;

      executionsMapped[newKey] = executions[key];

      return newKey;
    });

    const defectsMapped = {};
    const contentFieldsdefects = Object.keys(defects).map((key) => {
      const defectGroup = omit(defects[key], ['total']);
      const defectType = Object.keys(defectGroup)[0];
      const newKey = `statistics$defects$${key}$${defectType}`;

      defectsMapped[newKey] = defects[key][defectType];

      return newKey;
    });

    return {
      values: {
        ...executionsMapped,
        ...defectsMapped,
      },
      contentParameters: {
        contentFields: [...contentFieldsExec, ...contentFieldsdefects],
      },
    };
  };

  prepareWidgetData = ({ result: rawResult }) => {
    if (!rawResult) return null;

    const { id, name, number, startTime, statistics } = rawResult;
    const adaptedData = this.getStatisticsData(statistics);

    const result = [
      {
        id,
        name,
        number,
        startTime,
        values: adaptedData.values,
      },
    ];

    return {
      content: { result },
      contentParameters: adaptedData.contentParameters,
    };
  };

  containerRef = React.createRef();

  render() {
    const { data, intl } = this.props;
    const { isContainerRefReady } = this.state;
    const widgetData = this.prepareWidgetData(data);

    return (
      <div ref={this.containerRef} className={cx('last-launch')}>
        {widgetData && isContainerRefReady ? (
          <LaunchExecutionAndIssueStatistics
            widget={widgetData}
            container={this.containerRef.current}
            onStatusPageMode
          />
        ) : (
          <div className={cx('no-data-wrapper')}>
            <NoDataAvailable message={intl.formatMessage(messages.noDataMessage)} />
          </div>
        )}
      </div>
    );
  }
}
