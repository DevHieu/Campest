import React, { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import styles from "./ItineraryItem.module.css";

import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

function ItineraryItem({
  index,
  name,
  notes,
  lat,
  lng,
  color,
  setItinerary,
  swapMarker,
  deleteMarker,
  isLast,
  findMarker,
}) {
  const [currentNote, setCurrentNote] = useState(notes || "");
  const debouncedNote = useDebounce(currentNote, 500);

  // Update note after debounced
  useEffect(() => {
    setItinerary((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], notes: debouncedNote };
      return updated;
    });
  }, [debouncedNote]);

  const handleDelete = () => {
    setItinerary((prev) => {
      const deleteValue = [...prev];
      deleteValue.splice(index, 1);
      return deleteValue;
    });
    deleteMarker(index);
  };

  const handleMoveUp = () => {
    setItinerary((prev) => {
      const move = [...prev];
      [move[index], move[index - 1]] = [move[index - 1], move[index]];
      return move;
    });

    swapMarker(index, true);
  };

  const handleMoveDown = () => {
    setItinerary((prev) => {
      const move = [...prev];
      [move[index], move[index + 1]] = [move[index + 1], move[index]];
      return move;
    });

    swapMarker(index, false);
  };

  return (
    <div className={styles.iti_item}>
      <div className={styles.index} style={{ backgroundColor: color }}>
        {index + 1}
      </div>
      <div className={styles.content}>
        <button
          onClick={() => {
            findMarker(parseFloat(lat), parseFloat(lng), index);
          }}
        >
          {name}
        </button>
        <TextField
          placeholder="Thêm ghi chú..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          multiline
          variant="outlined"
          sx={{
            width: "80%",
            "& .MuiInputBase-root": {
              borderRadius: 0,
              backgroundColor: "transparent",
              border: "none",
              padding: "10px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
        />
      </div>
      <div className={styles.action}>
        <IconButton
          aria-label="delete"
          className={styles.action_btn}
          onClick={handleDelete}
        >
          <DeleteOutlineIcon className={styles.delete} />
        </IconButton>
        <IconButton
          aria-label="move up"
          className={styles.action_btn}
          onClick={handleMoveUp}
          disabled={index === 0}
        >
          <ArrowUpwardIcon />
        </IconButton>
        <IconButton
          aria-label="move down"
          className={styles.action_btn}
          onClick={handleMoveDown}
          disabled={isLast}
        >
          <ArrowDownwardIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default ItineraryItem;
