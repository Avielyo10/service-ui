import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import React from 'react';
import { PROJECT_DETAILS_PAGE } from 'controllers/pages';
import { Icon } from 'components/main/icon/icon';

export const ProjectStatisticButton = ({ projectName, onClick }) => (
  <Link
    to={{
      type: PROJECT_DETAILS_PAGE,
      payload: { projectId: projectName },
    }}
    onClick={onClick}
  >
    <Icon type={'icon-statistics'} />
  </Link>
);

ProjectStatisticButton.propTypes = {
  projectName: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

ProjectStatisticButton.defaultProps = {
  onClick: () => {},
};
