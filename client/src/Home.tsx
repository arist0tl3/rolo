import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useLocalStorage from 'use-local-storage';
import { FaPencilAlt } from 'react-icons/fa';

import { highlight, lightText, offWhite, secondary } from 'colors';

import Content from 'Content';
import Header from 'Header';
import HeaderTitle from 'HeaderTitle';

import { Contact } from 'types';

const CreateContactButton = styled.button`
  outline: 0;
  border: 0;
  background: ${highlight};
  height: 28px;
  border-radius: 4px;

  svg {
    fill: ${lightText};
  }
`;

const ContactList = styled.ul`
  list-style: none;
`;

const ContactListItem = styled.li`
  padding: 8px 16px;
  background: ${offWhite};
  border-bottom: 1px solid ${secondary};
`;

const ContactName = styled.div`
  font-size: 20px;
`;

const ContactLocation = styled.div``;

function Home() {
  const [contacts] = useLocalStorage<any>('contacts', []);

  return (
    <>
      <Header>
        <HeaderTitle>{'Rolo'}</HeaderTitle>
        <Link to={'/new'}>
          <CreateContactButton>
            <FaPencilAlt />
          </CreateContactButton>
        </Link>
      </Header>
      <Content>
        <ContactList>
          {contacts.map((contact: Contact) => (
            <ContactListItem key={contact._id}>
              <ContactName>{contact.firstName}</ContactName>
              <ContactLocation>{contact?.place?.locationName}</ContactLocation>
            </ContactListItem>
          ))}
        </ContactList>
      </Content>
    </>
  );
}

export default Home;
