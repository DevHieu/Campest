import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RequireAuthDialog({ open, onClose }) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chưa đăng nhập</DialogTitle>
      <DialogContent>Đăng nhập đi rồi hãy xài chức năng này 😏</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={() => navigate("/login")}>
          Đăng nhập
        </Button>
      </DialogActions>
    </Dialog>
  );
}
