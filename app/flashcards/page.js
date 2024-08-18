"use client"; // This directive enables client-side rendering in a Next.js application.
import { useEffect, useState } from "react"; // Import hooks from React.
import { useRouter } from "next/navigation"; // Import Next.js navigation hook for programmatic routing.
import { useUser } from "@clerk/nextjs"; // Import useUser hook from Clerk for user authentication.
import { collection, doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions for database interactions.
import FlashcardListUI from "./nameList"; // Import the FlashcardListUI component.
import db from "@/firebase"; // Import the configured Firestore database instance.

// The main Flashcard component.
export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser(); // Destructure user authentication states from Clerk's useUser hook.
  const [flashcards, setFlashcards] = useState([]); // Initialize state to store flashcards data.
  const [openDialog, setOpenDialog] = useState(false); // Initialize state to manage dialog visibility (not currently used).
  const router = useRouter(); // Initialize router for programmatic navigation.

  useEffect(() => {
    // Fetch flashcards when the component mounts or when the user changes.
    async function getFlashcards() {
      if (!user) return; // Exit early if user is not available.
      const docRef = doc(collection(db, "users"), user.id); // Reference the user's document in Firestore.
      const docSnap = await getDoc(docRef); // Fetch the document snapshot.
      console.log(docSnap.exists());

      if (docSnap.exists()) {
        // If the document exists, retrieve the flashcards collection.
        console.log(docSnap.data());
        const collections = docSnap.data().flashcardNames || []; // Default to an empty array if no flashcards exist.
        console.log(collections);
        setFlashcards(collections); // Update the flashcards state.
      } else {
        // If the document does not exist, create it with an empty flashcards array.
        await setDoc(docRef, { flashcards: [] });
      }
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

  // Return an empty fragment while the user is loading or not signed in.
  if (!isLoaded || !isSignedIn) {
    return <></>;
  }

  // Render the UI using the FlashcardListUI component.
  return (
    <FlashcardListUI
      flashcards={flashcards}
      handleCardClick={handleCardClick}
      handleStartCreating={handleStartCreating}
    />
  );
}
