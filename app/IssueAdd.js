import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, FormControl, Button } from 'react-bootstrap';

export default class IssueAdd extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    console.log('==> soumission du formulaire')
    e.preventDefault();
    var form = document.forms.issueAdd;
    this.props.createIssue(
      {
        owner: form.owner.value,
        title: form.title.value,
        status: 'NEW',
        created: new Date()
      }
    );
    // clear the form for the next input
    form.owner.value = "";
    form.title.value = "";
  }

  render() {
    return (
      <div>
        <Form inline name="issueAdd" onSubmit={this.handleSubmit}>
          <FormControl name="owner" placeholder="Owner" />
          {' '}
          <FormControl name="title" placeholder="Title" />
          {' '}
          <Button type="submit" bsStyle="primary">Add</Button>
        </Form>
      </div>
    )
  }
}

IssueAdd.propTypes = {
  createIssue: PropTypes.func.isRequired,
};
