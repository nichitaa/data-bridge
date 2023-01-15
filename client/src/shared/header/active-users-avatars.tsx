import { Avatar, styled } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { currentActiveUsersAtom, currentUserAtom } from '../../recoil/atoms';
import { teal } from '@mui/material/colors';

const ActiveUsersAvatars = () => {
  const currentActiveUsers = useRecoilValue(currentActiveUsersAtom);
  const currentUser = useRecoilValue(currentUserAtom);

  return (
    <StyledActiveUsersAvatars
      // > 1 excluding self presence
      showBorder={currentActiveUsers.length > 1}
    >
      {currentActiveUsers.map((user) => {
        const { metas } = user;
        if (metas?.[0].user_id !== currentUser?.userId) {
          return (
            <Avatar
              key={metas?.[0].user_id}
              sx={{
                maxWidth: 24,
                height: 24,
                backgroundColor: teal[500],
              }}
            >
              {metas?.[0].user_email?.[0]}
            </Avatar>
          );
        }
        return null;
      })}
    </StyledActiveUsersAvatars>
  );
};

interface StyledActiveUsersAvatarsProps {
  showBorder?: boolean;
}

const StyledActiveUsersAvatars = styled(`div`, {
  shouldForwardProp: (prop) => !['showBorder'].includes(prop as string),
})<StyledActiveUsersAvatarsProps>(({ theme, showBorder }) => ({
  display: 'flex',
  gap: 8,
  justifyContent: 'center',
  alignItems: 'center',
  ...(showBorder && {
    borderRadius: 5,
    border: `1px solid`,
    borderColor: teal[500],
  }),
  paddingRight: 8,
  paddingLeft: 8,
}));

export default ActiveUsersAvatars;
