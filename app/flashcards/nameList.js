import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, Button } from "@mui/material"; // Import MUI components for UI elements.

export default function FlashcardListUI({ flashcards, handleCardClick, handleStartCreating }) {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Saved Flashcards
      </Typography>

      {flashcards.length === 0 ? (
        // If no flashcards are saved, show a message and a button to create new collections.
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            No Saved Collections Yet
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleStartCreating}
          >
            Start Creating Collections
          </Button>
        </Box>
      ) : (
        // If flashcards are available, display them in a grid layout.
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h5" component="div">
                      {flashcard.name} {/* Display the name of the flashcard collection. */}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
