import React from 'react';
import PropTypes from 'prop-types';

export default class NumInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = { value: this.format(props.value) };
    this.onBlur = this.onBlur.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    this.setState({ value: this.format(newProps.value) });
  }

  onBlur(e) {
    console.log('==> onBlur dans NumImput');
    this.props.onChange(e, this.unformat(this.state.value));
  }

  // On ne change le state que si la valeur est valide!!!
  // cad un nombre
  onChange(e) {
    if (e.target.value.match(/^\d*$/)) {
      this.setState({ value: e.target.value });
    }
  }

  // Conversion en string pour l'affichage
  format(num) {
    return num != null ? num.toString() : '';
  }

  // Conversion dans le type naturel pour le state parent
  unformat(str) {
    const val = parseInt(str, 10);
    return isNaN(val) ? null : val;
  }

  render() {
    // on utilise un spread attribute pour récupérer les propriétés 
    // spécifiés par le parent comme la taille du champ (size={5})
    return (
      <input type="text" {...this.props} value={this.state.value} 
        onBlur={this.onBlur} onChange={this.onChange}
      />
    );
  }
}

NumInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};