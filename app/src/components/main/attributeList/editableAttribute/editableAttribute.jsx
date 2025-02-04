import { Component } from 'react';
import PropTypes from 'prop-types';
import { Attribute } from './attribute';
import { AttributeEditor } from './attributeEditor';

export class EditableAttribute extends Component {
  static propTypes = {
    attribute: PropTypes.object,
    attributes: PropTypes.array,
    editMode: PropTypes.bool,
    disabled: PropTypes.bool,
    onEdit: PropTypes.func,
    onRemove: PropTypes.func,
    onChange: PropTypes.func,
    onCancelEdit: PropTypes.func,
    keyURLCreator: PropTypes.func.isRequired,
    valueURLCreator: PropTypes.func.isRequired,
  };

  static defaultProps = {
    attribute: {},
    attributes: [],
    editMode: false,
    disabled: false,
    onEdit: () => {},
    onRemove: () => {},
    onChange: () => {},
    onCancelEdit: () => {},
  };

  calculateFormName = (attribute) =>
    attribute && attribute.key && attribute.value
      ? `attributesEditor__${attribute.key}_${attribute.value}`.replace(/\W/g, '_')
      : 'attributesEditor';

  render() {
    const { attribute, onChange, onEdit, onCancelEdit, editMode, ...rest } = this.props;
    return editMode ? (
      <AttributeEditor
        {...rest}
        form={this.calculateFormName(attribute)}
        initialValues={attribute}
        onConfirm={onChange}
        onCancel={onCancelEdit}
      />
    ) : (
      <Attribute {...this.props} onClick={onEdit} />
    );
  }
}
