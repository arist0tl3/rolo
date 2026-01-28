import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useLocalStorage from 'use-local-storage';
import { FaPencilAlt } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useState } from 'react';

import { darkText, highlight, lightText, offWhite, secondary } from 'colors';

import Content from 'Content';
import Header from 'Header';
import HeaderTitle from 'HeaderTitle';
import PWAInstallBanner from 'PWAInstallBanner';
import UnstyledLink from 'UnstyledLink';

import { Contact } from 'types';

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderButton = styled.button`
  outline: 0;
  border: 0;
  background: ${highlight};
  height: 28px;
  border-radius: 4px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: ${lightText};
  }
`;

const SecondaryHeaderButton = styled(HeaderButton)`
  background: ${secondary};

  svg {
    fill: ${darkText};
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

const ExportOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
`;

const ExportCard = styled.div`
  width: min(520px, 100%);
  background: ${offWhite};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ExportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const ExportTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const ExportSubtitle = styled.div`
  font-size: 12px;
  color: ${secondary};
`;

const ExportTextarea = styled.textarea`
  width: 100%;
  min-height: 220px;
  border-radius: 6px;
  border: 1px solid ${secondary};
  padding: 10px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: ${offWhite};
  color: ${darkText};
  resize: vertical;
`;

const ExportActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ExportButton = styled.button`
  border: 0;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  background: ${highlight};
  color: ${lightText};
`;

const ExportSecondaryButton = styled(ExportButton)`
  background: ${secondary};
  color: ${darkText};
`;

function Home() {
  const [contacts] = useLocalStorage<Contact[]>('contacts', []);
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);

  const sortedContacts = contacts.sort((a, b) => (a.firstName < b.firstName ? -1 : 1));

  const showContacts = !!contacts?.length;
  const showWelcome = !contacts?.length;
  const contactsJson = JSON.stringify(contacts, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contactsJson);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <Header>
        <UnstyledLink to={'/'}>
          <HeaderTitle>{'Rolo'}</HeaderTitle>
        </UnstyledLink>
        <HeaderActions>
          <SecondaryHeaderButton
            onClick={() => {
              setCopied(false);
              setShowExport(true);
            }}
            title="Export contacts"
          >
            <FaDownload />
          </SecondaryHeaderButton>
          <Link to={'/contacts/new'}>
            <HeaderButton>
              <FaPencilAlt />
            </HeaderButton>
          </Link>
        </HeaderActions>
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

      {showExport && (
        <ExportOverlay>
          <ExportCard>
            <ExportHeader>
              <div>
                <ExportTitle>{'Export local contacts'}</ExportTitle>
                <ExportSubtitle>{'Copy this JSON and save it somewhere safe.'}</ExportSubtitle>
              </div>
              <SecondaryHeaderButton onClick={() => setShowExport(false)} title="Close">
                <MdClose />
              </SecondaryHeaderButton>
            </ExportHeader>
            <ExportTextarea readOnly value={contactsJson} spellCheck={false} />
            <ExportActions>
              <ExportSecondaryButton onClick={() => setShowExport(false)}>{'Close'}</ExportSecondaryButton>
              <ExportButton onClick={handleCopy}>{copied ? 'Copied' : 'Copy JSON'}</ExportButton>
            </ExportActions>
          </ExportCard>
        </ExportOverlay>
      )}
    </>
  );
}

export default Home;
