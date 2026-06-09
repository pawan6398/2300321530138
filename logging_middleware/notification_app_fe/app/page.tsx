 "use client";

import { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";

export default function Home() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("http://4.224.186.213/evaluation-service/notifications?limit=50&page=1")
      .then(res => res.json())
      .then(res => setData(res.notifications || []))
      .catch(err => console.log(err));
  }, []);

  const filtered =
    filter === "All"
      ? data
      : data.filter(n => n.Type === filter);

  return (
    <Container style={{ marginTop: 20 }}>
      <Typography variant="h4" gutterBottom>
        All Notifications
      </Typography>

      <FormControl fullWidth style={{ marginBottom: 20 }}>
        <InputLabel>Filter</InputLabel>
        <Select value={filter} label="Filter" onChange={(e) => setFilter(e.target.value)}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
        </Select>
      </FormControl>

      {filtered.map((n) => (
        <Card key={n.ID} style={{ marginBottom: 10 }}>
          <CardContent>
            <Typography variant="h6">{n.Type}</Typography>
            <Typography>{n.Message}</Typography>
            <Typography variant="caption">{n.Timestamp}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
