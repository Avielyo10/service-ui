import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import Link from 'redux-first-router-link';
import { TEST_ITEM_PAGE, launchIdSelector, filterIdSelector } from 'controllers/pages';
import { activeProjectSelector } from 'controllers/user';
import styles from './groupHeader.scss';

const cx = classNames.bind(styles);

const createLink = (projectId, filterId, launchId, testItemIds) => ({
  type: TEST_ITEM_PAGE,
  payload: {
    projectId,
    filterId,
    testItemIds: [launchId, ...testItemIds].join('/'),
  },
});

export const GroupHeader = connect((state) => ({
  activeProject: activeProjectSelector(state),
  launchId: launchIdSelector(state),
  filterId: filterIdSelector(state),
}))(({ data, activeProject, launchId, filterId }) => (
  <div className={cx('group-header-row')}>
    {/* td inside of div because of EPMRPP-36916 */}
    <td className={cx('group-header-content')} colSpan={100}>
      {Object.keys(data[0].pathNames || {}).map((key, i, array) => (
        <Fragment key={key}>
          <Link
            className={cx('link')}
            to={createLink(activeProject, filterId, launchId, array.slice(0, i + 1))}
          >
            {data[0].pathNames[key]}
          </Link>
          {i < array.length - 1 && <span className={cx('separator')}> / </span>}
        </Fragment>
      ))}
    </td>
  </div>
));
GroupHeader.propTypes = {
  data: PropTypes.array,
};
GroupHeader.defaultProps = {
  data: [],
};
