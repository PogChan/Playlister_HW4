import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its
    name or deleting it.

    @author McKilla Gorilla
*/
function ListCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const [editActive, setEditActive] = useState(false);

  const { idNamePair, selected } = props;
  const [text, setText] = useState(idNamePair.name);
  const [disableButt, setDisableButt] = useState(false);

  function handleLoadList(event, id) {
    console.log('handleLoadList for ' + id);
    if (!event.target.disabled) {
      let _id = event.target.id;
      if (_id.indexOf('list-card-text-') >= 0)
        _id = ('' + _id).substring('list-card-text-'.length);

      console.log('load ' + event.target.id);

      // CHANGE THE CURRENT LIST
      store.setCurrentList(id);
    }
  }

  function handleToggleEdit(event) {
    event.stopPropagation();
    setDisableButt(true);
    toggleEdit();
  }

  function toggleEdit() {
    let newActive = !editActive;
    if (newActive) {
      store.setIsListNameEditActive();
    }
    setEditActive(newActive);
  }

  async function handleDeleteList(event, id) {
    event.stopPropagation();
    let _id = event.target.id;
    _id = ('' + _id).substring('delete-list-'.length);
    store.markListForDeletion(id);
  }

  function handleKeyPress(event) {
    if (event.code === 'Enter') {
      let id = event.target.id.substring('list-'.length);

      store.changeListName(id, text);
      setDisableButt(false);
      toggleEdit();
    }
  }
  function handleUpdateText(event) {
    setText(event.target.value);
  }

  let selectClass = 'unselected-list-card';
  if (selected) {
    selectClass = 'selected-list-card';
  }
  let cardStatus = false;
  if (store.listNameActive) {
    console.log('ListNameACT');
    cardStatus = true;
  }
  let cardElement = (
    <ListItem
      id={idNamePair._id}
      key={idNamePair._id}
      className={selectClass}
      sx={{
        marginTop: '15px',
        display: 'flex',
        p: 1,
        borderStyle: 'solid',
        borderWidth: 'medium',
        borderColor: '#669966',
      }}
      style={{
        width: '100%',
        fontSize: '36pt',

        padding: '15px',
        borderRadius: '25px',
        backgroundColor: '#e1e4cb',
        '&:hover': {
          backgroundColor: 'black',
        },
      }}
      button
      disabled={cardStatus}
      onClick={(event) => {
        handleLoadList(event, idNamePair._id);
      }}
    >
      <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.name}</Box>
      <Box sx={{ p: 1 }}>
        <IconButton
          disabled={cardStatus}
          onClick={handleToggleEdit}
          aria-label="edit"
        >
          <EditIcon style={{ fontSize: '48pt' }} />
        </IconButton>
      </Box>
      <Box sx={{ p: 1 }}>
        <IconButton
          disabled={cardStatus}
          onClick={(event) => {
            handleDeleteList(event, idNamePair._id);
          }}
          aria-label="delete"
        >
          <DeleteIcon style={{ fontSize: '48pt' }} />
        </IconButton>
      </Box>
    </ListItem>
  );

  if (editActive) {
    cardElement = (
      <TextField
        margin="normal"
        required
        fullWidth
        id={'list-' + idNamePair._id}
        label="Playlist Name"
        name="name"
        autoComplete="Playlist Name"
        className="list-card"
        onKeyPress={handleKeyPress}
        onChange={handleUpdateText}
        defaultValue={idNamePair.name}
        inputProps={{ style: { fontSize: 48 } }}
        InputLabelProps={{ style: { fontSize: 24 } }}
        autoFocus
      />
    );
  }
  return cardElement;
}

export default ListCard;
