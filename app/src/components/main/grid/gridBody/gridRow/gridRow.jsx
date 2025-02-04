import React, { Component } from 'react';
import track from 'react-tracking';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { LOG_MESSAGE_HIGHLIGHT_TIMEOUT } from '../../constants';
import { columnPropTypes } from '../../propTypes';
import { GridCell } from './gridCell';
import { CheckboxCell } from './checkboxCell';
import styles from './gridRow.scss';

const cx = classNames.bind(styles);
const LEVEL_OFFSET = 20;

@track()
export class GridRow extends Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape(columnPropTypes)),
    value: PropTypes.object,
    selectable: PropTypes.bool,
    selectedItems: PropTypes.arrayOf(PropTypes.object),
    onToggleSelection: PropTypes.func,
    changeOnlyMobileLayout: PropTypes.bool,
    rowClassMapper: PropTypes.func,
    toggleAccordionEventInfo: PropTypes.object,
    tracking: PropTypes.shape({
      trackEvent: PropTypes.func,
      getTrackingData: PropTypes.func,
    }).isRequired,
    rowHighlightingConfig: PropTypes.shape({
      onGridRowHighlighted: PropTypes.func,
      isGridRowHighlighted: PropTypes.bool,
      highlightedRowId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    excludeFromSelection: PropTypes.arrayOf(PropTypes.object),
    gridRowClassName: PropTypes.string,
    level: PropTypes.number,
  };

  static defaultProps = {
    columns: [],
    value: {},
    selectable: false,
    selectedItems: [],
    onToggleSelection: () => {},
    changeOnlyMobileLayout: false,
    rowClassMapper: null,
    toggleAccordionEventInfo: {},
    rowHighlightingConfig: {
      onGridRowHighlighted: () => {},
      isGridRowHighlighted: false,
      highlightedRowId: '',
    },
    excludeFromSelection: [],
    gridRowClassName: '',
    level: 0,
  };

  state = {
    withAccordion: false,
    expanded: false,
    updateHighlight: true,
  };

  componentDidMount() {
    this.handleAccordion();

    if (!!this.props.rowHighlightingConfig.highlightedRowId && this.state.updateHighlight) {
      // eslint-disable-next-line
      this.setState({ updateHighlight: false });
    }
  }

  componentDidUpdate() {
    this.handleAccordion();

    if (this.checkIfTheHighlightNeeded()) {
      this.highLightGridRow();
    }
  }

  setupRef = (overflowCell) => {
    this.overflowCell = overflowCell;
  };

  setupAccordion = () => {
    this.setState({ withAccordion: true });
    this.overflowCell.style.maxHeight = `${this.overflowCellMaxHeight}px`;
  };

  getHighLightBlockSize = () =>
    this.rowRef && this.rowRef.current
      ? {
          left: LEVEL_OFFSET * this.props.level,
          height: `${this.rowRef.current.clientHeight}px`,
          width: `${this.rowRef.current.clientWidth - LEVEL_OFFSET * this.props.level}px`,
        }
      : {};

  getHighlightBlockClasses = () =>
    this.checkIfTheHighlightNeeded() ? this.highLightBlockClasses : '';

  isItemSelected = () => this.props.selectedItems.some((item) => item.id === this.props.value.id);

  isItemDisabled = () =>
    this.props.excludeFromSelection.some((item) => item.id === this.props.value.id);

  checkIfTheHighlightNeeded = () => {
    const { highlightedRowId, isGridRowHighlighted } = this.props.rowHighlightingConfig;

    return (
      this.highlightBlockRef.current &&
      highlightedRowId === this.props.value.id &&
      !isGridRowHighlighted
    );
  };

  highlightBlockRef = React.createRef();

  rowRef = React.createRef();

  highLightBlockClasses = `${cx('highlight')} ${cx('hide-highlight')}`;

  highLightGridRow() {
    this.highlightBlockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      this.props.rowHighlightingConfig.onGridRowHighlighted();
    }, LOG_MESSAGE_HIGHLIGHT_TIMEOUT);
  }

  removeAccordion = () => {
    this.setState({ withAccordion: false });
    this.overflowCell.style.maxHeight = null;
  };

  handleAccordion = () => {
    if (!this.overflowCell) {
      return;
    }

    if (this.overflowCell.offsetHeight > this.overflowCellMaxHeight) {
      !this.state.withAccordion && this.setupAccordion();
    } else if (this.overflowCell.offsetHeight < this.overflowCellMaxHeight) {
      this.state.withAccordion && this.removeAccordion();
    }
  };

  toggleAccordion = () => {
    if (!this.overflowCell) {
      return;
    }

    this.props.tracking.trackEvent(this.props.toggleAccordionEventInfo);

    this.setState({ expanded: !this.state.expanded }, () => {
      this.overflowCell.style.maxHeight = !this.state.expanded
        ? `${this.overflowCellMaxHeight}px`
        : null;
    });
  };

  render() {
    const {
      columns,
      value,
      selectable,
      changeOnlyMobileLayout,
      rowClassMapper,
      gridRowClassName,
      level,
    } = this.props;

    const { expanded } = this.state;
    const customClasses = (rowClassMapper && rowClassMapper(value)) || {};

    return (
      <div
        className={cx('grid-row-wrapper', {
          selected: this.isItemSelected(),
          ...customClasses,
        })}
        data-id={value.id}
        ref={this.rowRef}
      >
        <div className={cx('grid-row')}>
          <div
            ref={this.highlightBlockRef}
            className={cx('highlight-block', this.getHighlightBlockClasses())}
            style={this.getHighLightBlockSize()}
          />
        </div>
        {this.state.withAccordion && (
          <div className={cx('accordion-wrapper-mobile')}>
            <div
              className={cx('accordion-toggler-mobile', { rotated: this.state.expanded })}
              onClick={this.toggleAccordion}
            />
          </div>
        )}
        <div
          className={cx(
            'grid-row',
            { 'change-mobile': changeOnlyMobileLayout, [`level-${level}`]: level !== 0 },
            gridRowClassName,
          )}
        >
          {columns.map((column, i) => {
            if (column.maxHeight) {
              this.overflowCellMaxHeight = column.maxHeight;
            }
            const cell = (
              <GridCell
                key={column.id || i}
                refFunction={column.maxHeight ? this.setupRef : null}
                mobileWidth={column.mobileWidth}
                value={value}
                id={column.id}
                align={column.align}
                component={column.component}
                formatter={column.formatter}
                title={column.title}
                customProps={column.customProps}
                expanded={expanded}
                toggleExpand={this.toggleAccordion}
              />
            );
            if (level && i === 0) {
              return (
                <div
                  key={column.id || i}
                  className={cx('first-col-wrapper', {
                    'change-mobile': changeOnlyMobileLayout,
                    [`level-${level}`]: level !== 0,
                  })}
                >
                  {cell}
                </div>
              );
            }
            return cell;
          })}
          {selectable && (
            <GridCell
              align={'right'}
              component={CheckboxCell}
              value={value}
              customProps={{
                disabled: this.isItemDisabled(),
                selected: this.isItemSelected(),
                onChange: this.props.onToggleSelection,
              }}
            />
          )}
        </div>
        {this.state.withAccordion && (
          <div className={cx('grid-row')}>
            <div className={cx('accordion-wrapper', { [`level-${level}`]: level !== 0 })}>
              <div className={cx('accordion-block', { expanded: this.state.expanded })}>
                <div
                  className={cx('accordion-toggler', { rotated: this.state.expanded })}
                  onClick={this.toggleAccordion}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
