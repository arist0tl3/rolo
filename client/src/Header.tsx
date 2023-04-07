import styled from 'styled-components';

import { lightText, primary } from 'colors';

const Header = styled.div`
  padding: 0 16px;
  width: 100%;
  height: 48px;
  background: ${primary};
  color: ${lightText};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

export default Header;
