import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Table, Panel } from 'react-bootstrap';

import IssueRow from './IssueRow.js';
import IssueFilter from './IssueFilter.js';


// Un composant plus classique avec un return,
// indispensable lorsque la fonction comprend plus d'une instruction
function IssueTable(props) {
  const issueRows = props.issues.map(issue => <IssueRow key={issue.id} issue={issue}/>)
  return (
    <Table bordered condensed hover responsive>
      <thead>
        <tr>
          <th>Id</th>
          <th>Status</th>
          <th>Owner</th>
          <th>Created</th>
          <th>Effort</th>
          <th>Completion Date</th>
          <th>Title</th>
          <th></th>
        </tr>
      </thead>
      <tbody>{issueRows}</tbody>
    </Table>
  );
}

IssueTable.propTypes = {
  issues: PropTypes.array.isRequired
};

export default class IssueList extends Component {
  // On définit le state dans le constructeur
  constructor() {
    super();
    // l'état initial est un tableau d'issues vide
    this.state = {
      issues: [],
      toastVisible: false, toastMessage: '', toastType: 'success',
    };
    this.setFilter = this.setFilter.bind(this);
    this.showError = this.showError.bind(this);
    this.dismissToast = this.dismissToast.bind(this);
  }

  showError(message) {
    this.setState({ toastVisible: true, toastMessage: message, toastType:'danger' });
  }

  dismissToast() {
    this.setState({ toastVisible: false });
  }

  // Méthode appelée lorsque la page est rechargée
  componentDidMount() {
    this.loadData();
  }

  // Méthode appelée lorsqu'une propriété du composant change
  // React Router parse la query string dans l'url et la rend disponible
  // au composant dans une propriété nommée 'location'
  componentDidUpdate(prevProps) {
    const oldQuery = prevProps.location.query;
    const newQuery = this.props.location.query;
    if (oldQuery.status === newQuery.status
        && oldQuery.effort_gte === newQuery.effort_gte
        && oldQuery.effort_lte === newQuery.effort_lte) {
      return;
    }
    this.loadData();
  }

  // Chargement des données
  loadData() {
    // on récupère les 'issues' depuis le backend
    console.log('Loading data from : ' + `/api/issues${this.props.location.search}`);
    fetch(`/api/issues${this.props.location.search}`).then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log("Nb d'enregistrements:", data._metadata.total_count);
          data.records.forEach(issue => {
            issue.created = new Date(issue.created);
            if (issue.completionDate) {
              issue.completionDate = new Date(issue.completionDate);
            }
          });
          // le nouveau state contient les enregistrements récupérés
          this.setState({ issues: data.records });
        });
      } else {
        response.json().then(error => {
          this.showError(`Failed to fetch issues ${error.message}`);
        });
      }
    }).catch(err => {
      this.showError(`Error in fetching data from server: ${err}`);
      //this.setState({ issues: mockupIssues });
    });
  }

  

  // la méthode setFilter prend en paramètre un objet query du type : { status: 'Open' }
  // on utilise la méthode push du router pour changer la query string en conservant le
  // pathname
  setFilter(query) {
    this.props.router.push({ pathname: this.props.location.pathname, query });
  }

  render() {
    return (
      <div>
        <Panel collapsible header="Filter">
          <IssueFilter setFilter={this.setFilter} initFilter={this.props.location.query} />
        </Panel>
        <hr />
        <IssueTable issues={this.state.issues}/>
        <hr />
        
      </div>
    );
  }
}

IssueList.propTypes = {
  location: PropTypes.object.isRequired
};
