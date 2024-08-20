import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, Button } from "@mui/material";

export default function FlashcardListUI({ flashcards, handleCardClick, handleStartCreating }) {
  return (
    <Container sx={{ mt: '15vh' }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Saved Flashcards
      </Typography>

      {flashcards.length === 0 ? (
        // If no flashcards are saved, show a message and a button to create new collections.
        <Box sx={{ textAlign: "center", mt: '15vh' }}>
          <Typography variant="h4" gutterBottom color="#D9D9D9">
            No Saved Collections Yet
          </Typography>

          <Button
            variant="contained"
            sx={{ 
              backgroundColor: "#3C6E71", // Button color
              px: 7, // Expanded padding
              py: 1,
              borderRadius: 7, // Rounder borders
              mt: 3,
              "&:hover": {
                backgroundColor: "#3C6E71", // Remove hover effect
              },
            }}
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
              <Card sx={{
                backgroundColor: "#3C6E71", // Card background color
                color: "white", // Card text color
                borderRadius: "16px", // Rounder borders
                boxShadow: "none" // Remove box shadow
              }}>
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
