export const lichessUserInfoRequest = async (username: string) => {
  const response = await fetch(`https://lichess.org/api/user/${username}`);
  return await response.json();
}