import { useContext, useState } from 'react';
import GlobalStoreContext from '../store';

import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  zIndex: 10,
};

export default function MUIErrorModal(props) {
  const { store } = useContext(GlobalStoreContext);

  let name = '';
  console.log(props.errMessage);
  function handleCloseModal(event) {
    props.closeErrorModal();
  }

  return (
    <Modal open={props.openErrModal}>
      <Box sx={style}>
        <Alert severity="error">ERROR: {props.errMessage}</Alert>
        <div id="confirm-cancel-container">
          <Button
            id="dialog-no-button"
            variant="contained"
            className="modal-button"
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
