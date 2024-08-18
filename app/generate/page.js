"use client"; // This directive allows the component to run on the client side.

// components/Generate.js

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
} from '@mui/material';
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import db from '@/firebase';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Flashcards from './flipable';

export default function Generate() {
  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [setName, setSetName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

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
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>

        {flashcards.length > 0 && (
          <Flashcards
            flashcards={flashcards}
            flipped={flipped}
            handleCardClick={handleCardClick}
          />
        )}

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              Save Flashcards
            </Button>
          </Box>
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
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
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
