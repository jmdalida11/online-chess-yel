import Box from '@mui/material/Box/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import { useRecoilState } from 'recoil';
import { sideBarOpenAtom } from '../store/atoms/common';
import PersonIcon from '@mui/icons-material/Person';
import { ReactNode } from 'react';

interface OptionItem {
  text: string;
  icon: ReactNode;
}

const SideBar = () => {
  const [isOpen, setIsOpen] = useRecoilState(sideBarOpenAtom);
  const optionItems: OptionItem[] = [{
      text: 'Account',
      icon: <PersonIcon />
    },
    {
      text: 'Inbox',
      icon: <InboxIcon />
    },
    {
      text: 'Mail',
      icon: <MailIcon />
    }
  ];

  return <>
    <Drawer 
      anchor={'left'}
      open={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}>
        <Box
          role="presentation"
        >
          <List>
            {optionItems.map(({text, icon}) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
    </Drawer>
  </>
}

export default SideBar;