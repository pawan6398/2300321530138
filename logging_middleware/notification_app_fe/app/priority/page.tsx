"use client";

import { useEffect, useState } from "react";
import { Container, Card, CardContent, Typography } from "@mui/material";

const priorityMap: any = {
  Placement: 3,
  Result: 2,
  Event: 1
};

export default function PriorityPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://4.224.186.213/evaluation-service/notifications?limit=50&page=1")
      .then(res => res.json())
      .then(res => {
        const sorted = (res.notifications || [])
          .sort((a: any, b: any) =>
            (priorityMap[b.Type] || 0) - (priorityMap[a.Type] || 0)
          );

        setData(sorted.slice(0, 10));
      });
  }, []);

  return (
    <Container style={{ marginTop: 20 }}>
      <Typography variant="h4">Priority Inbox</Typography>

      {data.map((n: any) => (
        <Card key={n.ID} style={{ marginTop: 10 }}>
          <CardContent>
            <Typography>{n.Type}</Typography>
            <Typography>{n.Message}</Typography>
            <Typography variant="caption">{n.Timestamp}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}