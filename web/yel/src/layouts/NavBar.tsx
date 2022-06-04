import { Link } from "react-router-dom";
import styled from "styled-components";
import { PageRoute } from "../constants/route";
import MenuIcon from '@mui/icons-material/Menu';
import { useSetRecoilState } from "recoil";
import { sideBarOpenAtom } from "../store/atoms/common";

const Container = styled.div`
  background-color: #121212;
  padding: 10px;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
`;

const StyledNav = styled.nav`
  display: flex;
  align-items: center;

  > ${StyledLink} {
    margin: 10px;
  }
`;

const StyledMenuIcon = styled(MenuIcon)`
  cursor: pointer;
`;

const NavBar = () => {
  const setSideBarOpen = useSetRecoilState(sideBarOpenAtom);

  const openSideBar = () => {
    setSideBarOpen(true);
  }

  return <Container>
    <StyledNav>
      <StyledMenuIcon htmlColor="white" onClick={openSideBar} />
      <StyledLink to={PageRoute.Home}>Home</StyledLink>
      <StyledLink to={PageRoute.Play}>Play</StyledLink>
      <StyledLink to={PageRoute.Tournament}>Tournament</StyledLink>
    </StyledNav>
  </Container>
}

export default NavBar;