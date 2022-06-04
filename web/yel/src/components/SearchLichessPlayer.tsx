import { useState } from "react";
import { lichessUserInfoRequest } from "../apis/lichess";
import styled from 'styled-components';
import moment from 'moment';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

interface LichessProfile {
  country: string;
  location: string;
  bio: string;
  firstName: string;
  lastName: string;
  fideRating: number;
  uscfRating: number;
  ecfRating: number;
  links: string;
}

interface UserInfo {
  id: string;
  username: string;
  online: boolean;
  profile: LichessProfile;
  title: string;
  url: string;
  seenAt: number;
}

const PlayerTitleStyle = styled.span`
  color: #bf811d;
  font-weight: bold;
`;

const ListItemStyle = styled.li`
  list-style-type: none;
`;

const Container = styled.div``;

const InputWrapper = styled.div`
  margin-bottom: 20px;
`;

const SearchLichessPlayer = () => {
  const [lichessUsername, setLichessUsername] = useState('');
  const [userInfoState, setUserInfoState] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const searchUser = async (e: any) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const userInfo: UserInfo = await lichessUserInfoRequest(lichessUsername);
      setUserInfoState(userInfo);
      console.log(userInfo);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const displayTitle = () => {
    return <>{userInfoState?.title ? <PlayerTitleStyle>{userInfoState?.title} </PlayerTitleStyle> : null}</>
  }

  const displayProfile = () => {
    return <>
      <ListItemStyle>Name: {displayTitle()}{userInfoState?.profile.firstName} {userInfoState?.profile.lastName}</ListItemStyle>
      {userInfoState?.profile.bio && <ListItemStyle>Bio: {userInfoState?.profile.bio}</ListItemStyle>}
    </>
  }

  return <Container>
    <InputWrapper>
      <form>
        <input type='text' placeholder="Enter Username" value={lichessUsername} onChange={(e) => {
          setLichessUsername(e.target.value);
        }} />
        <button onClick={searchUser}>Search User</button>
      </form>
    </InputWrapper>
    {isLoading && <div>Loading...</div>}
    {!isLoading && userInfoState && <div>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <ul>
            <ListItemStyle>Username: {userInfoState?.username}</ListItemStyle>
            {userInfoState.profile && displayProfile()}
            {userInfoState?.url && <ListItemStyle>Profile Url: <a href={userInfoState?.url} target="_blanck" rel="noopener">{userInfoState?.url}</a></ListItemStyle>}
            {userInfoState?.seenAt && <ListItemStyle>Active: {moment(userInfoState.seenAt).startOf('second').fromNow()}</ListItemStyle>}
          </ul>
        </CardContent>
      </Card>
    </div>}
</Container>
}

export default SearchLichessPlayer;