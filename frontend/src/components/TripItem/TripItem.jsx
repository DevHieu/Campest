import * as React from "react";
import { Link } from "react-router-dom";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import styles from "./TripItem.module.css";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";

function TripItem({ id, index, name, startDate, endDate, setItineraries }) {
  const url = import.meta.env.VITE_BACKEND_API;
  const { cookies } = useAuth();
  const [openConfirm, setOpenConfirm] = React.useState(false);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleConfirmDelete = () => {
    const options = {
      headers: {
        Authorization: `Bearer ${cookies.token}`, // Dùng token từ user
      },
    };
    axios.delete(`${url}/itinerary/delete-itinerary/${id}`, options);

    //remove itinerary from array
    setItineraries((prev) => {
      const deleteValue = [...prev];
      deleteValue.splice(index, 1);
      return deleteValue;
    });

    setOpenConfirm(false);
  };

  return (
    <div className={styles.item_wrapper}>
      <Link to={`/schedule/trip/${id}`} className={styles.left}>
        <h4 className={styles.name}>{name}</h4>
        <div className={styles.date}>
          <p>Bắt đầu vào ngày: {startDate}</p>
          <p>Kết thúc vào ngày: {endDate}</p>
        </div>
      </Link>
      <div className={styles.right}>
        <IconButton onClick={handleOpenConfirm}>
          <DeleteOutlineIcon className={styles.icon} />
        </IconButton>

        {/* Dialog confirm */}
        <Dialog open={openConfirm} onClose={handleCloseConfirm}>
          <DialogTitle>Bạn có chắc muốn xoá?</DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseConfirm}>Huỷ</Button>
            <Button onClick={handleConfirmDelete} color="error">
              Xoá
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default TripItem;
