import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useLocalStorage from 'use-local-storage';
import { FaPencilAlt } from 'react-icons/fa';

import { darkText, highlight, lightText, offWhite, secondary } from 'colors';

import Content from 'Content';
import Header from 'Header';
import HeaderTitle from 'HeaderTitle';
import UnstyledLink from 'UnstyledLink';

import isAndroid from 'utils/isAndroid';
import isIOS from 'utils/isIOS';
import isSafari from 'utils/isSafari';

import { Contact } from 'types';

// 7 days
const BANNER_WINDOW = 1000 * 60 * 60 * 24 * 7;

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

const Banner = styled.div`
  width: 100vw;
  min-height: 144px;
  background: #ffffff;
  box-shadow: 0 -4px 4px rgb(0 0 0 / 4%);
  border-top: 1px solid #cecece;
  position: fixed;
  bottom: 70px;
  left: 0;
  z-index: 100;
  padding: 16px;
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const ImageWrapper = styled.div`
  margin-right: 8px;

  img {
    width: 48px;
    height: 48px;
  }
`;

const SiteInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const SiteName = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const SiteAddress = styled.div``;

const CloseButton = styled.button`
  margin: 0;
  padding: 8px;
  background: none;
  border: none;
  position: absolute;
  top: -8px;
  right: -8px;
  cursor: pointer;
`;

const Bottom = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
  height: 56px;
`;

const Button = styled.button`
  color: ${lightText};
  background: ${darkText};
  border: 0;
  outline: 0;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 600;
  text-transform: uppercase;
`;

const IOS = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    margin: 8px 0 8px 0 !important;
    text-align: center;
  }
`;

const ShareIconWrapper = styled.span`
  img {
    height: 16px;
    margin: 0 4px;
    display: inline;
  }
`;

function Home() {
  const [contacts] = useLocalStorage<Contact[]>('contacts', []);
  const [lastBannerDismissDate, setLastBannerDismissDate] = useLocalStorage('lastBannerDismissDate', '');

  const sortedContacts = contacts.sort((a, b) => (a.firstName < b.firstName ? -1 : 1));

  const showContacts = !!contacts?.length;
  const showWelcome = !contacts?.length;

  const isPWA = window.matchMedia('(display-mode: standalone)').matches;

  const bannerWindowOkay = !lastBannerDismissDate ? true : new Date().getTime() - new Date(lastBannerDismissDate).getTime() > BANNER_WINDOW;

  const canShowIOSBanner = isIOS() && isSafari();
  const canShowAndroidBanner = isAndroid();

  const defaultShowAndroidBannerValue = bannerWindowOkay && canShowAndroidBanner && !isPWA;
  const defaultShowIOSBannerValue = bannerWindowOkay && canShowIOSBanner && !isPWA;

  const [showAndroidBanner, setShowAndroidBanner] = useState<boolean>(defaultShowAndroidBannerValue);
  const [showIOSBanner, setShowIOSBanner] = useState<boolean>(defaultShowIOSBannerValue);

  const handleAndroidCloseClick = () => {
    setShowAndroidBanner(false);
    setLastBannerDismissDate(new Date().toString());
  };

  const handleIOSCloseClick = () => {
    setShowIOSBanner(false);
    setLastBannerDismissDate(new Date().toString());
  };

  const handleAddClick = () => {
    window.promptEvent.prompt();
  };

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

        {showAndroidBanner && (
          <Banner>
            <Top>
              <SiteInfo>
                <SiteName>{'Homepost'}</SiteName>
                <SiteAddress>{'homepostapp.com'}</SiteAddress>
              </SiteInfo>
              <CloseButton onClick={handleAndroidCloseClick}>{'Close'}</CloseButton>
            </Top>
            <Bottom>
              <Button onClick={handleAddClick}>{'Add to home screen'}</Button>
            </Bottom>
          </Banner>
        )}

        {showIOSBanner && (
          <Banner>
            <IOS>
              <CloseButton onClick={handleIOSCloseClick} style={{ top: '0px', right: '0px ' }}>
                {'Close'}
              </CloseButton>
              <p>{'Install HomePost'}</p>
              <p>{'Install this app to your home screen so you can easily stay updated with your community'}</p>
              <p>
                {'Just tap'}
                {' the iOS share icon '}
                {'then "Add to Home Screen"'}
              </p>
            </IOS>
          </Banner>
        )}
      </Content>
    </>
  );
}

export default Home;
