import React from "react";
import { Avatar, Box, Typography, Rating, Stack } from "@mui/material";

const CommentItem = ({ comment }) => {
  return (
    <Box
      sx={{ display: "flex", gap: 2, py: 2, borderBottom: "1px solid #eee" }}
    >
      <Avatar alt={comment.author_name} src={comment.profile_photo_url} />

      <Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle1" fontWeight={600}>
            {comment.author_name}
          </Typography>
          <Rating
            value={comment.rating}
            readOnly
            size="small"
            precision={0.5}
          />
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {comment.relative_time_description}
        </Typography>

        <Typography variant="body2" mt={1}>
          {comment.text}
        </Typography>
      </Box>
    </Box>
  );
};

export default CommentItem;
