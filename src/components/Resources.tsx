import { Box, Typography, Container, Paper, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const resourceCards = [
  {
    title: "Stress Support",
    text: "Take a short pause, breathe in for 4 seconds, hold for 4, and breathe out for 6. Repeat for a few rounds and focus on one task at a time.",
  },
  {
    title: "Anxiety Support",
    text: "Try the 5-4-3-2-1 grounding method: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
  },
  {
    title: "Low Mood Support",
    text: "Start very small. Drink water, open a window, or take a short walk. Small steps still count and can help build momentum.",
  },
  {
    title: "Crisis Support",
    text: "If you feel in immediate danger, call 911 now. In the U.S. or Canada, call or text 988 for urgent emotional support.",
  },
];

function Resources() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Mental Health Resources
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quick support tools and crisis information for this prototype.
            </Typography>
          </Box>

          <Button
            onClick={() => navigate("/home")}
            sx={{
              py: 1,
              px: 3,
              borderRadius: 2,
              background: "transparent",
              border: "2px solid transparent",
              backgroundImage:
                "linear-gradient(#1a1a1a, #1a1a1a), linear-gradient(135deg, #60a5fa, #34d399)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              color: "white",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                backgroundImage:
                  "linear-gradient(#242424, #242424), linear-gradient(135deg, #60a5fa, #34d399)",
              },
            }}
          >
            Back to Chat
          </Button>
        </Box>

        <Grid container spacing={3}>
          {resourceCards.map((card) => (
            <Grid size={{ xs: 12, md: 6 }} key={card.title}>
              <Paper
                sx={{
                  p: 3,
                  height: "100%",
                  bgcolor: "#242424",
                  borderRadius: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                  {card.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {card.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Resources;
