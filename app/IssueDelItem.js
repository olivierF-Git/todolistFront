import React, { Component } from 'react';
import { withRouter } from 'react-router';
import PropTypes, { node } from 'prop-types';
import { NavItem, Glyphicon, Modal, Button, ButtonToolbar } from 'react-bootstrap';
import Toast from './Toast.js';

class IssueDelItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showing: false,
            toastVisible: false, toastMessage: '', toastType: 'success',
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.submit = this.submit.bind(this);
        this.showError = this.showError.bind(this);
        this.dismissToast = this.dismissToast.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
    }

    showModal() {
        this.setState({ showing: true });
    }

    hideModal() {
        this.setState({ showing: false });
    }

    showError(message) {
        this.setState({
            toastVisible: true, toastMessage: message,
            toastType: 'danger'
        });
    }

    dismissToast() {
        this.setState({ toastVisible: false });
    }

    onDeleteClick() {
        this.deleteIssue(this.props.issue);
    }

    deleteIssue(id) {
        fetch(`/api/issues/${id}`, {
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) {
                alert('Failed to delete issue');
            } else {
                window.location.reload(false);
            }
        });
    }

    submit(e) {
        e.preventDefault();
        this.hideModal();
        this.onDeleteClick();
    }
    
    render() {
        return (
            <NavItem style={{ listStyle:'none'}} onClick={this.showModal}>
                <Button bsSize="xsmall"><Glyphicon glyph="trash"/></Button>
                <Modal keyboard show={this.state.showing} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Do you want to delete this Issue ?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <ButtonToolbar>
                            <Button type="button" bsStyle="primary" onClick={this.submit}>Delete</Button>
                            <Button bsStyle="link" onClick={this.hideModal}>Cancel</Button>
                        </ButtonToolbar>
                    </Modal.Footer>
                </Modal>
                <Toast showing={this.state.toastVisible} message={this.state.toastMessage}
                    onDismiss={this.dismissToast} bsStyle={this.state.toastType}
                />
            </NavItem >
        );
    }
}

IssueDelItem.propTypes = {
    issue: PropTypes.string.isRequired
};

export default withRouter(IssueDelItem);