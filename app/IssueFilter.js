import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row, FormGroup, FormControl, ControlLabel, InputGroup, ButtonToolbar, Button } from 'react-bootstrap';

/*
 * Composant de filtrage
 *
 * On utilise e.preventDefault pour éviter de déclencher l'action par défaut
 * sur les liens hypertextes. Ceci est indispensable afin d'éviter le retoure
 * vers l'URL #.
 */
export default class IssueFilter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stat: [],
      status: props.initFilter.status || '',
      effort_gte: props.initFilter.effort_gte || '',
      effort_lte: props.initFilter.effort_lte || '',
      changed: false
    };
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeEffortGte = this.onChangeEffortGte.bind(this);
    this.onChangeEffortLte = this.onChangeEffortLte.bind(this);
    this.applyFilter = this.applyFilter.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      status: newProps.initFilter.status,
      effort_gte: newProps.initFilter.effort_gte || '',
      effort_lte: newProps.initFilter.effort_lte || '',
      changed: false
    });
  }

  onChangeStatus(e) {
    this.setState({
      status: e.target.value,
      changed: true
    });
  }

  onChangeEffortGte(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({
        effort_gte: e.target.value,
        changed: true
      });
    }
  }

  onChangeEffortLte(e) {
    const effortString = e.target.value;
    if (effortString.match(/^\d*$/)) {
      this.setState({
        effort_lte: e.target.value,
        changed: true
      });
    }
  }

  applyFilter() {
    const newFilter = {};
    if (this.state.status) newFilter.status = this.state.status;
    if (this.state.effort_gte) newFilter.effort_gte = this.state.effort_gte;
    if (this.state.effort_lte) newFilter.effort_lte = this.state.effort_lte;
    this.props.setFilter(newFilter);
  }

  clearFilter() {
    this.props.setFilter({});
  }

  resetFilter() {
    this.setState({
      status: this.props.initFilter.status || '',
      effort_gte: this.props.initFilter.effort_gte || '',
      effort_lte: this.props.initFilter.effort_lte || '',
      changed: false,
    });
  }

  loadData() {
    fetch(`/api/issues/status`).then(response => {
      if (response.ok) {
        response.json().then(data => {
          this.setState({ stat: data });
        });
      } else {
        response.json().then(error => {
          this.showError(`Failed to fetch issues ${error.message}`);
        });
      }
    }).catch(err => {
      this.showError(`Error in fetching data from server: ${err}`);
    });
  }

  render() {
    return (
      <Row>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Status</ControlLabel>
            <FormControl componentClass="select" value={this.state.status} onChange={this.onChangeStatus}>
              <option value=""> (Any) </option>
              {(this.state.stat).map(stat => <option value={stat.replaceAll("_", " ")}> {stat} </option>)}
            </FormControl>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>Effort</ControlLabel>
            <InputGroup>
              <FormControl value={this.state.effort_gte} onChange={this.onChangeEffortGte} />
              <InputGroup.Addon>-</InputGroup.Addon>
              <FormControl value={this.state.effort_lte} onChange={this.onChangeEffortLte} />
            </InputGroup>
          </FormGroup>
        </Col>
        <Col xs={6} sm={4} md={3} lg={2}>
          <FormGroup>
            <ControlLabel>&nbsp;</ControlLabel>
            <ButtonToolbar>
              <Button bsStyle="primary" onClick={this.applyFilter}>Apply</Button>
              <Button onClick={this.resetFilter} disabled={!this.state.changed}>Reset</Button>
              <Button onClick={this.clearFilter}>Clear</Button>
            </ButtonToolbar>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}

IssueFilter.propTypes = {
  setFilter: PropTypes.func.isRequired,
  initFilter: PropTypes.object.isRequired,
};
