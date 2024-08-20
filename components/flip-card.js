import React from 'react';
import { Box, Grid, Card, CardContent, CardActionArea, Typography } from '@mui/material';

const Flashcards = ({ flashcards, flipped, handleCardClick }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ boxShadow: 'none' }}> {/* Removed box shadow from outer card */}
              <CardActionArea onClick={() => handleCardClick(index)}>
                <CardContent>
                  <Box
                    sx={{
                      perspective: "1000px",
                      "& > div": {
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        transformStyle: "preserve-3d",
                        transform: flipped[index]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                        transition: "transform 0.6s ease-in-out",
                        borderRadius: 2, // Rounded borders for inner cards
                      },
                      "& > div > div": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 2,
                        boxSizing: "border-box",
                        color: "white", // Set text color to white
                        borderRadius: 2, // Rounded borders for inner card sides
                      },
                      "& > div > div:nth-of-type(1)": {
                        backgroundColor: "#284B63", // Front card color
                      },
                      "& > div > div:nth-of-type(2)": {
                        backgroundColor: "#3C6E71", // Back card color
                        transform: "rotateY(180deg)",
                      },
                    }}
                  >
                    <div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.front} {/* Display front content */}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.back} {/* Display back content */}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Flashcards;
