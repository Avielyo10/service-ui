import { Component } from 'react';
import { withTooltip } from 'components/main/tooltips/tooltip';
import PropTypes from 'prop-types';
import { WarningTooltip } from './warningTooltip';

@withTooltip({
  TooltipComponent: WarningTooltip,
  data: { width: 450, placement: 'right', noArrow: true },
})
export class ButtonWithTooltip extends Component {
  static propTypes = {
    children: PropTypes.node,
  };
  static defaultProps = {
    children: null,
  };

  render() {
    return this.props.children;
  }
}
