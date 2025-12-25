import { Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";

export default function CampToolPage() {
  const [alert, setAlert] = useState(false);

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlert(false);
  };

  return (
    <div>
      Chức năng chưa hoàn thành
      <Snackbar
        open={alert}
        autoHideDuration={3000} // 3 giây
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // vị trí
      >
        <Alert onClose={handleCloseAlert} severity="warning">
          Chức năng sẽ thêm trong tương lai
        </Alert>
      </Snackbar>
    </div>
  );
}
