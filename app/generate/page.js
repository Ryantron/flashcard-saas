"use client"; // This directive allows the component to run on the client side.

import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  CircularProgress,
} from '@mui/material';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import db from '@/firebase';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Flashcards from '@/components/flip-card';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import InputAdornment from '@mui/material/InputAdornment';
import ResponsiveAppBar from "@/components/navbar";

export default function Generate() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading

  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    setLoading(true); // Set loading to true

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards! Please try again.");
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after completion
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpenDialog = () => setDialogOpen(true);

  const handleCloseDialog = () => setDialogOpen(false);

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert("Please enter a name for your flashcard set.");
      return;
    }

    try {
      const userDocRef = doc(collection(db, "users"), user.id);
      const userDocSnap = await getDoc(userDocRef);

      const batch = writeBatch(db);

      if (userDocSnap.exists()) {
        const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName.toLowerCase());
        const setDocSnap = await getDoc(setDocRef);

        if (setDocSnap.exists()) {
          const existingFlashcards = setDocSnap.data().flashcards || [];
          const updatedFlashcards = [...existingFlashcards, ...flashcards];

          batch.update(setDocRef, { flashcards: updatedFlashcards });
        } else {
          batch.set(setDocRef, { flashcards });
        }

        const userData = userDocSnap.data();
        const existingNames = userData.flashcardNames || [];
        const isNameExisting = existingNames.some((set) => set.name === setName);

        if (!isNameExisting) {
          const updatedSets = [...existingNames, { name: setName }];
          batch.update(userDocRef, { flashcardNames: updatedSets });
        }
      } else {
        batch.set(userDocRef, { flashcardNames: [{ name: setName }] });
        const setDocRef = doc(collection(userDocRef, "flashcardSets"), setName.toLowerCase());
        batch.set(setDocRef, { flashcards });
      }

      await batch.commit();

      alert("Flashcards saved successfully!");
      handleCloseDialog();
      setSetName("");
      router.push("/flashcards");
    } catch (error) {
      console.error("Error saving flashcards:", error);
      alert("An error occurred while saving flashcards. Please try again.");
    }
  };

  return (
    <Box>
      <ResponsiveAppBar userPresent={true}/>
      <Container>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 2 }}>
          <Typography variant="h4" gutterBottom>
            Flashcard Generator
          </Typography>
          
          {flashcards.length > 0 ? (
            <Paper sx={{ flex: 1, p: 2, overflowY: 'auto', mb: 2, boxShadow: 'none' }}>
              <Flashcards
                flashcards={flashcards}
                flipped={flipped}
                handleCardClick={handleCardClick}
              />
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                {isSignedIn ? (
                  <Button
                    variant="contained"
                    sx={{ 
                      backgroundColor: '#3C6E71', 
                      borderRadius: 20,  // Rounder border
                      '&:hover': { backgroundColor: '#2F575D' },
                      px: 4,
                      py: 1,
                    }}
                    onClick={handleOpenDialog}
                  >
                    Save Flashcards
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    sx={{ 
                      backgroundColor: '#3C6E71', 
                      borderRadius: 20,  // Rounder border
                      '&:hover': { backgroundColor: '#2F575D' },
                      px: 4,
                      py: 1,
                    }}
                    href="/sign-in"
                  >
                    Sign in to save flashcard set
                  </Button>
                )}
              </Box>
            </Paper>
          ) : (
            <Paper sx={{ flex: 1, p: 2, overflowY: 'auto', mb: 2, boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" sx={{ color: '#D9D9D9' }}>
                What subject do you want to study up on?
              </Typography>
            </Paper>
          )}

          <Box sx={{ position: 'static', bottom: 0, left: 0, right: 0, p: 2, bgcolor: 'background.paper', display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              variant="outlined"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !loading) handleSubmit();
              }}
              sx={{
                borderRadius: 30,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 30,
                  pl: 3,
                  pr: 1,
                },
                '& .MuiOutlinedInput-notchedOutline.Mui-focused': {
                  borderColor: '#3C6E71',
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      onClick={handleSubmit}
                      disabled={loading} // Disable button while loading
                      sx={{
                        borderRadius: '50%',
                        bgcolor: '#3C6E71',
                        color: 'white',
                        '&:hover': {
                          bgcolor: '#2F575D',
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: '#3C6E71' }} />
                      ) : (
                        <ArrowUpwardIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Dialog open={dialogOpen} onClose={handleCloseDialog} 
            PaperProps={{
              sx: { 
                minWidth: '400px' // Widened dialog box
              }
            }}
          >
            <DialogTitle>Save Flashcards</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter a name for your flashcard set:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Set Name"
                fullWidth
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} sx={{ color: '#3C6E71' }}>
                Cancel
              </Button>
              <Button onClick={saveFlashcards} sx={{ color: '#3C6E71' }}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </Box>
  );
}
