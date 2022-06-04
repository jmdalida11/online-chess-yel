import { Route, Routes } from "react-router";
import { PageRoute } from "./constants/route";
import NavBar from "./layouts/NavBar";
import SideBar from "./layouts/SideBar";
import Tournament from "./pages/Tournament";
import Home from "./pages/Home";
import Container from '@mui/material/Container';
import styled from 'styled-components';
import Play from "./pages/Play";

const StyledContainer = styled(Container)`
  padding-top: 10px;
`;

const App = () => {
  return (
    <div>
      <NavBar />
      <SideBar />
      <StyledContainer fixed>
        <Routes>
          <Route path={PageRoute.Home} element={<Home />} />
          <Route path={PageRoute.Play} element={<Play />} />
          <Route path={PageRoute.Tournament} element={<Tournament />} />
        </Routes>
      </StyledContainer>
    </div>
  );
}

export default App;
