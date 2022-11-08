import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import SongCard from './SongCard.js';
import MUIEditSongModal from './MUIEditSongModal';
import MUIRemoveSongModal from './MUIRemoveSongModal';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { GlobalStoreContext } from '../store/index.js';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.

    @author McKilla Gorilla
*/
function WorkspaceScreen() {
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();

  useEffect(() => {
    if (store.currentList === null) {
      const URLID = store.history.location.pathname.split('/')[2];
      console.log('CURRENT LIST IS NULL');

      store.hasPlaylistById(URLID);
      console.log('WAITING ON THE THING AND RETURNING RN');
    }
    console.log(store.currentList);
  }, [store]);

  let modalJSX = '';
  if (store.isEditSongModalOpen()) {
    modalJSX = <MUIEditSongModal />;
  } else if (store.isRemoveSongModalOpen()) {
    modalJSX = <MUIRemoveSongModal />;
  }

  if (store.currentList !== null) {
    return (
      <Box>
        <List
          id="playlist-cards"
          sx={{ width: '100%', bgcolor: 'background.paper' }}
        >
          {store.currentList.songs.map((song, index) => (
            <SongCard
              id={'playlist-song-' + index}
              key={'playlist-song-' + index}
              index={index}
              song={song}
            />
          ))}
        </List>
        {modalJSX}
      </Box>
    );
  }
  console.log('HEHE did it bfre');
  return <Box></Box>;
}

export default WorkspaceScreen;
