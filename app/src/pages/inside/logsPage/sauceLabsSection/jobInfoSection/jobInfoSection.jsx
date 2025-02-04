import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { injectIntl } from 'react-intl';
import {
  sauceLabsLogsSelector,
  sauceLabsAuthTokenSelector,
  sauceLabsAssetsSelector,
} from 'controllers/log/sauceLabs';
import { ContainerWithTabs } from 'components/main/containerWithTabs';
import { COMMANDS_TAB, METADATA_TAB, LOGS_TAB } from './constants';
import { messages } from './messages';
import { CommandsContent } from './commandsContent';
import { LogsContent } from './logsContent';
import { MetadataContent } from './metadataContent';
import styles from './jobInfoSection.scss';

const cx = classNames.bind(styles);

@connect((state) => ({
  logs: sauceLabsLogsSelector(state),
  assets: sauceLabsAssetsSelector(state),
  authToken: sauceLabsAuthTokenSelector(state),
}))
@injectIntl
export class JobInfoSection extends Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    logs: PropTypes.array,
    assets: PropTypes.object,
    authToken: PropTypes.string,
    observer: PropTypes.object,
    isFullscreenMode: PropTypes.bool,
  };

  static defaultProps = {
    logs: [],
    assets: {},
    authToken: '',
    observer: {},
    isFullscreenMode: false,
  };

  getTabsConfig = () => {
    const {
      intl: { formatMessage },
      authToken,
      logs,
      assets,
      observer,
      isFullscreenMode,
    } = this.props;

    return [
      {
        name: formatMessage(messages[COMMANDS_TAB]),
        content: (
          <CommandsContent
            authToken={authToken}
            commands={logs}
            assets={assets}
            observer={observer}
            isFullscreenMode={isFullscreenMode}
          />
        ),
      },
      {
        name: formatMessage(messages[LOGS_TAB]),
        content: (
          <LogsContent
            logs={logs}
            assets={assets}
            authToken={authToken}
            isFullscreenMode={isFullscreenMode}
          />
        ),
      },
      {
        name: formatMessage(messages[METADATA_TAB]),
        content: (
          <MetadataContent
            assets={assets}
            authToken={authToken}
            isFullscreenMode={isFullscreenMode}
          />
        ),
      },
    ];
  };

  render() {
    return (
      <div className={cx('job-info-section')}>
        <ContainerWithTabs data={this.getTabsConfig()} customClass={cx('section-header')} />
      </div>
    );
  }
}
