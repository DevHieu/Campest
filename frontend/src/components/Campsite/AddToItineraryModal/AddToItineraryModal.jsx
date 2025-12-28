import {
  Modal,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchSchedule } from "../../../store/scheduleSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default function AddToItineraryModal({
  open,
  onClose,
  onSelect,
  userId,
}) {
  const [itineraries, setItineraries] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getAllItineraries = async () => {
      try {
        const res = await dispatch(fetchSchedule({ page: 0, size: 100 }));
        setItineraries(res.payload.content);
      } catch (error) {
        console.error("Failed to fetch itineraries:", error);
      }
    };

    getAllItineraries();
  }, [userId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Chọn lộ trình
        </Typography>

        <List>
          {itineraries?.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => {
                onSelect(item.id);
                onClose();
              }}
            >
              <ListItemText
                primary={item.name}
                secondary={`${item.startDate} - ${item.endDate}`}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Modal>
  );
}
