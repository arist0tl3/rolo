import { useState } from 'react';
import styled from 'styled-components';
import useLocalStorage from 'use-local-storage';

import { darkText, lightText } from 'colors';

import isAndroid from 'utils/isAndroid';
import isIOS from 'utils/isIOS';
import isSafari from 'utils/isSafari';

// 7 days
const BANNER_WINDOW = 1000 * 60 * 60 * 24 * 7;

const Banner = styled.div`
  width: 100vw;
  min-height: 144px;
  background: #ffffff;
  box-shadow: 0 -4px 4px rgb(0 0 0 / 4%);
  border-top: 1px solid #cecece;
  position: fixed;
  bottom: 0px;
  left: 0;
  z-index: 100;
  padding: 16px;
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
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

function PWAInstallBanner() {
  const [lastBannerDismissDate, setLastBannerDismissDate] = useLocalStorage('lastBannerDismissDate', '');

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
      {showAndroidBanner && (
        <Banner>
          <Top>
            <SiteInfo>
              <SiteName>{'Rolo'}</SiteName>
              <SiteAddress>{'rolo.ninja'}</SiteAddress>
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
            <p>{'Install Rolo'}</p>
            <p>{'Install this app to your home screen so you can keep your industry friends close at hand'}</p>
            <p>
              {'Just tap'}
              {' the iOS share icon '}
              {'then "Add to Home Screen"'}
            </p>
          </IOS>
        </Banner>
      )}
    </>
  );
}

export default PWAInstallBanner;
