// app/flashcards/set/page.js
'use client'
import { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import db from '@/firebase';
import Flashcards from '@/components/flip-card';
import { useUser } from '@clerk/nextjs'; // Import useUser from Clerk
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

export default function FlashcardSetPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // Get 'id' from query parameters
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Call useUser inside the component
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!id || !isSignedIn || !user) return; // Exit if no id or user is not signed in

    const fetchFlashcards = async () => {
      try {
        const setDocRef = doc(db, "users", user.id, "flashcardSets", id.toLowerCase());
        const setDocSnap = await getDoc(setDocRef);

        if (setDocSnap.exists()) {
          setFlashcards(setDocSnap.data().flashcards || []);
        } else {
          setError('Flashcard set not found.');
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        setError('An error occurred while fetching flashcards.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [id, isSignedIn, user]); // Include id, isSignedIn, and user in dependency array

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" component="div" sx={{ mt: 2 }}>
          Loading flashcards...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6" component="div">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Flashcard Set: {id}
        </Typography>
        {flashcards.length > 0 ? (
          <Flashcards
            flashcards={flashcards}
            flipped={flipped}
            handleCardClick={handleCardClick}
          />
        ) : (
          <Typography variant="h6" component="div">
            No flashcards found for this set.
          </Typography>
        )}
      </Box>
    </Container>
  );
}
