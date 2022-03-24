import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import IssueDelItem from './IssueDelItem';


export default class IssueRow extends Component {
  constructor() {
    super();
  }

  render() {
    // On récupère l'attribut issue dans les props histoire de factoriser
    const { issue } = this.props; 
    return (
      <tr>
        <td><Link to={`/issues/${issue.id}`}>{issue.id.substring(0, 4)}</Link></td>
        <td>{issue.status}</td>
        <td>{issue.owner}</td>
        <td>{issue.created.toDateString()}</td>
        <td>{issue.effort}</td>
        <td>{issue.completionDate ? issue.completionDate.toDateString() : ''}</td>
        <td>{issue.title}</td>
        <td><IssueDelItem issue={issue.id} /></td>
      </tr>
    );
  }
}

IssueRow.propTypes = {
  issue: PropTypes.object.isRequired
};
