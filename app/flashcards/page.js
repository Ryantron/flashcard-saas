"use client"; // This directive enables client-side rendering in a Next.js application.
import { useEffect, useState } from "react"; // Import hooks from React.
import { useRouter } from "next/navigation"; // Import Next.js navigation hook for programmatic routing.
import { useUser } from "@clerk/nextjs"; // Import useUser hook from Clerk for user authentication.
import { collection, doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions for database interactions.
import FlashcardListUI from "./nameList"; // Import the FlashcardListUI component.
import db from "@/firebase"; // Import the configured Firestore database instance.
import { CircularProgress, Box } from "@mui/material"; // Import CircularProgress for loading animation.
import ResponsiveAppBar from "@/components/navbar"; // Import ResponsiveAppBar for navigation.

// The main Flashcard component.
export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser(); // Destructure user authentication states from Clerk's useUser hook.
  const [flashcards, setFlashcards] = useState([]); // Initialize state to store flashcards data.
  const [loading, setLoading] = useState(true); // Initialize state to manage loading status.
  const [openDialog, setOpenDialog] = useState(false); // Initialize state to manage dialog visibility (not currently used).
  const router = useRouter(); // Initialize router for programmatic navigation.

  useEffect(() => {
    // Fetch flashcards when the component mounts or when the user changes.
    async function getFlashcards() {
      if (!user) {
        setLoading(false); // Stop loading if user is not available.
        return;
      }

      const docRef = doc(collection(db, "users"), user.id); // Reference the user's document in Firestore.
      const docSnap = await getDoc(docRef); // Fetch the document snapshot.
      console.log(docSnap.exists());

      if (docSnap.exists()) {
        // If the document exists, retrieve the flashcards collection.
        const collections = docSnap.data().flashcardNames || []; // Default to an empty array if no flashcards exist.
        setFlashcards(collections); // Update the flashcards state.
      } else {
        // If the document does not exist, create it with an empty flashcards array.
        await setDoc(docRef, { flashcardNames: [] });
      }

      setLoading(false); // Stop loading after fetching data.
    }

    getFlashcards(); // Call the async function.
  }, [user]); // Run the effect when the user changes.

  // Handle card click event to navigate to the flashcard's detail page.
  const handleCardClick = (id) => {
    router.push(`/flashcards/set?id=${id}`); // Redirect to the flashcard details page with the selected flashcard's ID as a query parameter.
  };

  // Close the dialog (though it's currently unused).
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle button click to start creating a new flashcard collection.
  const handleStartCreating = () => {
    router.push("/generate"); // Navigate to the flashcard generation page.
  };

  // Render a circular progress spinner while loading.
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        width="100vw"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to sign-in page if the user is not signed in.
  if (!isLoaded)return null; // Prevent further rendering.
  else if (!isSignedIn) router.push("/sign-in");

  // Render the UI using the FlashcardListUI component.
  return (
    <Box>
      <ResponsiveAppBar userPresent={true} />
      <FlashcardListUI
        flashcards={flashcards}
        handleCardClick={handleCardClick}
        handleStartCreating={handleStartCreating}
      />
    </Box>
  );
}
