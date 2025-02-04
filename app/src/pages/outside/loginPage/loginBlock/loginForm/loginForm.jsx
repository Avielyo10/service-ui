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
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Parser from 'html-react-parser';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import Link from 'redux-first-router-link';
import { validate } from 'common/utils';
import { authExtensionsSelector } from 'controllers/appInfo';
import { loginAction, lastFailedLoginTimeSelector } from 'controllers/auth';
import { LOGIN_PAGE } from 'controllers/pages';
import { FieldErrorHint } from 'components/fields/fieldErrorHint';
import { InputOutside } from 'components/inputs/inputOutside';
import { BigButton } from 'components/buttons/bigButton';
import { FieldProvider } from 'components/fields/fieldProvider';
import WarningIcon from 'common/img/error-inline.svg';
import LoginIcon from './img/login-field-icon-inline.svg';
import PasswordIcon from './img/password-field-icon-inline.svg';
import { ExternalLoginBlock } from './externalLoginBlock';
import styles from './loginForm.scss';

const cx = classNames.bind(styles);

const LOGIN_LIMIT_EXCEEDED_BLOCK_DURATION = 30;

const messages = defineMessages({
  login: {
    id: 'LoginForm.loginPlaceholder',
    defaultMessage: 'Login',
  },
  password: {
    id: 'LoginForm.passwordPlaceholder',
    defaultMessage: 'Password',
  },
  loginAttemptsExceeded: {
    id: 'LoginForm.loginAttemptsExceeded',
    defaultMessage:
      'You entered incorrectly login or password many times. Login form is blocked for <b>{time}</b> sec.',
  },
  errorMessage: {
    id: 'LoginForm.errorMessage',
    defaultMessage: 'Error',
  },
});

@connect(
  (state) => ({
    externalAuth: authExtensionsSelector(state),
    lastFailedLoginTime: lastFailedLoginTimeSelector(state),
  }),
  {
    authorize: loginAction,
  },
)
@reduxForm({
  form: 'loginPage',
  validate: ({ login, password }) => ({
    login: (!login || !validate.login(login)) && 'loginHint',
    password: (!password || !validate.password(password)) && 'passwordHint',
  }),
})
@injectIntl
export class LoginForm extends React.Component {
  static propTypes = {
    intl: intlShape.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    authorize: PropTypes.func.isRequired,
    externalAuth: PropTypes.object,
    lastFailedLoginTime: PropTypes.number,
  };

  static defaultProps = {
    externalAuth: {},
    lastFailedLoginTime: null,
  };

  constructor(props) {
    super(props);
    this.state = this.calculateLoginLimitState();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.lastFailedLoginTime !== this.props.lastFailedLoginTime) {
      this.blockLoginForm();
    }
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getLoginExceededDuration = () => ((Date.now() - this.props.lastFailedLoginTime) / 1000).toFixed();

  blockLoginForm = () => {
    const data = this.calculateLoginLimitState();

    this.setState(data);
  };

  calculateLoginLimitState = () => {
    const loginExceededDuration = this.getLoginExceededDuration();
    const isLoginLimitExceeded = loginExceededDuration <= LOGIN_LIMIT_EXCEEDED_BLOCK_DURATION;
    let blockTime = null;

    if (isLoginLimitExceeded) {
      blockTime = LOGIN_LIMIT_EXCEEDED_BLOCK_DURATION - loginExceededDuration;
      this.blockFormCountdown(blockTime);
    }

    return {
      blockTime,
      isLoginLimitExceeded,
    };
  };

  blockFormCountdown = (seconds) => {
    let blockTime = seconds;
    this.intervalId = setInterval(() => {
      blockTime -= 1;
      if (blockTime <= 0) {
        clearInterval(this.intervalId);
        this.setState({
          isLoginLimitExceeded: false,
        });
      } else {
        this.setState({
          blockTime,
        });
      }
    }, 1000);
  };

  render() {
    const {
      intl: { formatMessage },
      handleSubmit,
      externalAuth,
      authorize,
    } = this.props;
    const { blockTime, isLoginLimitExceeded } = this.state;

    return (
      <form className={cx('login-form')} onSubmit={handleSubmit(authorize)}>
        {!Utils.isEmptyObject(externalAuth) ? (
          <div>
            <ExternalLoginBlock externalAuth={externalAuth} />
            <div className={cx('separator')}>
              <div className={cx('line')} />
              <div className={cx('or')}>
                <FormattedMessage id={'LoginForm.or'} defaultMessage={'or'} />
              </div>
            </div>
          </div>
        ) : null}
        <div className={cx('login-field')}>
          <FieldProvider name="login">
            <FieldErrorHint>
              <InputOutside
                disabled={isLoginLimitExceeded}
                icon={LoginIcon}
                placeholder={formatMessage(messages.login)}
                maxLength="128"
              />
            </FieldErrorHint>
          </FieldProvider>
        </div>
        <div className={cx('password-field')}>
          <FieldProvider name="password">
            <FieldErrorHint>
              <InputOutside
                disabled={isLoginLimitExceeded}
                icon={PasswordIcon}
                placeholder={formatMessage(messages.password)}
                type="password"
              />
            </FieldErrorHint>
          </FieldProvider>
        </div>
        <Link
          to={{ type: LOGIN_PAGE, payload: { query: { forgotPass: 'true' } } }}
          className={cx('forgot-pass')}
        >
          <FormattedMessage id={'LoginForm.forgotPass'} defaultMessage={'Forgot password?'} />
        </Link>
        {isLoginLimitExceeded && (
          <div className={cx('attempts-exceeded-block')}>
            <span className={cx('warning')}>
              <i className={cx('warning-icon')}>{Parser(WarningIcon)}</i>
              {formatMessage(messages.errorMessage)}
            </span>
            <span>
              {Parser(formatMessage(messages.loginAttemptsExceeded, { time: blockTime }))}
            </span>
          </div>
        )}
        <div className={cx('login-button-container')}>
          <BigButton
            disabled={isLoginLimitExceeded}
            roundedCorners
            type="submit"
            color={'organish'}
          >
            <FormattedMessage id={'LoginForm.login'} defaultMessage={'Login'} />
          </BigButton>
        </div>
      </form>
    );
  }
}
