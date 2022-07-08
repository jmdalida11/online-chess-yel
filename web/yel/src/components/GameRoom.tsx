import { List, ListItem, ListItemText } from '@mui/material';
import styled from 'styled-components';

interface RoomInfo {
  roomId: string;
  roomName: string;
}

interface IProps {
  rooms: RoomInfo[];
  joinRoom: (id: string) => void;
}

const Container = styled.div`
  margin-top: 50px;
`;

const StyledListItem = styled(ListItem)`
  margin-top: 10px;
  width: '100%';
`;

const GameRooms = ({ rooms, joinRoom }: IProps) => {
  return <Container>
    <List >
      {
        rooms.map((item) => <StyledListItem sx={{ bgcolor: 'background.paper' }} key={item.roomId}>
          <ListItemText primary={item.roomName} />
          <button onClick={() => joinRoom(item.roomId)}>Join</button>
        </StyledListItem>)
      }
    </List>
  </Container>
}

export default GameRooms;
