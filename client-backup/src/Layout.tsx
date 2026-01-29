import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

function Layout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

export default Layout;
