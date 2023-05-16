import { Component } from 'react';
import { nanoid } from 'nanoid';
import Notiflix from 'notiflix';
import Form from './Form';
import ContactList from './ContactList';
import Filter from './Filter';

class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
    filter: '',
  };
  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  addNewContact = ({ name, number }) => {
    if (
      this.state.contacts.some(
        contact =>
          contact.name.toLowerCase() === name.toLowerCase() ||
          contact.number === number
      )
    ) {
      Notiflix.Notify.info(`${name} or ${number} is already in contacts!`);
      return;
    }

    const newContact = {
      id: nanoid(),
      name,
      number,
    };
    this.setState(prevState => ({
      contacts: [newContact, ...prevState.contacts],
    }));
  };

  delContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  changeFilter = event => {
    this.setState({
      filter: event.currentTarget.value,
    });
  };

  getFilteredContacts = () => {
    const toLowercaseFilter = this.state.filter.toLowerCase();

    return this.state.contacts.filter(contact =>
      contact.name.toLowerCase().includes(toLowercaseFilter)
    );
  };

  render() {
    const visibleContacts = this.getFilteredContacts();
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: 16,
          color: '#010101',
        }}
      >
        <Form onSubmit={this.addNewContact} />
        <Filter value={this.state.filter} onChange={this.changeFilter} />
        <ContactList contacts={visibleContacts} onDel={this.delContact} />
      </div>
    );
  }
}

export { App };
