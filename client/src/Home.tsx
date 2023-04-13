import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useLocalStorage from 'use-local-storage';
import { FaPencilAlt } from 'react-icons/fa';

import { highlight, lightText, offWhite, secondary } from 'colors';

import Content from 'Content';
import Header from 'Header';
import HeaderTitle from 'HeaderTitle';
import PWAInstallBanner from 'PWAInstallBanner';
import UnstyledLink from 'UnstyledLink';

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

const WelcomeWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  font-size: 24px;
`;

function Home() {
  const [contacts] = useLocalStorage<Contact[]>('contacts', []);

  const sortedContacts = contacts.sort((a, b) => (a.firstName < b.firstName ? -1 : 1));

  const showContacts = !!contacts?.length;
  const showWelcome = !contacts?.length;

  return (
    <>
      <Header>
        <UnstyledLink to={'/'}>
          <HeaderTitle>{'Rolo'}</HeaderTitle>
        </UnstyledLink>
        <Link to={'/contacts/new'}>
          <CreateContactButton>
            <FaPencilAlt />
          </CreateContactButton>
        </Link>
      </Header>
      <Content>
        {showWelcome && (
          <WelcomeWrapper>
            <div>{'Welcome to Rolo!'} </div>
            <div>{'Use the pencil button to add your first contact.'}</div>
          </WelcomeWrapper>
        )}
        {showContacts && (
          <ContactList>
            {sortedContacts.map((contact) => (
              <UnstyledLink key={contact._id} to={`/contacts/${contact._id}`}>
                <ContactListItem>
                  <ContactName>{contact.firstName}</ContactName>
                  <ContactLocation>{contact?.place?.locationName}</ContactLocation>
                </ContactListItem>
              </UnstyledLink>
            ))}
          </ContactList>
        )}

        <PWAInstallBanner />
      </Content>
    </>
  );
}

export default Home;
