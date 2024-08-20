import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import PricingPlans from "./plans";
import ResponsiveAppBar from "@/components/navbar"

// Note: next/head replaced with new built-in SEO support
// https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#step-3-migrating-nexthead

export const metadata = {
  title: "Flashcard SaaS",
  description: "Create flashcard from your text",
};

export default function Home() {
  return (
    <Box>
      {/* Header and navigation */}
      <ResponsiveAppBar userPresent={true}/>
      
        {/* Headline and call to action buttons */}
        <Box sx={{ textAlign: "center", my: 4, height: "85vh", paddingTop: "27vh"}}>
          <Container>
            <Typography variant="h2" component="h1" gutterBottom>
              Welcome to Flashcard SaaS
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
              The easiest way to create flashcards from your text.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, mr: 2, backgroundColor: "#3C6E71", '&:hover': { backgroundColor: "#3C6E71" } }}
              href="/generate"
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              sx={{ mt: 2, borderColor: "#3C6E71", color: "#3C6E71", '&:hover': { borderColor: "#3C6E71", color: "#3C6E71" } }}
            >
              Learn More
            </Button>
          </Container>
        </Box>

        {/* Features of app */}
        <Box sx={{ textAlign: "center", backgroundColor: "#3C6E71", color: "#fff", py: 10 }}>
          <Container>
          <Typography variant="h4" component="h2" gutterBottom>
            Features
          </Typography>

          {/* Feature items */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Easy Text Input
              </Typography>
              <Typography>
                Input your text and let our software do the rest! Creating
                flashcards has never been easier.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Smart Flashcards
              </Typography>
              <Typography>
                Our AI intelligently breaks down your text into concise
                flashcards, perfect for studying.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Accessible Anywhere
              </Typography>
              <Typography>
                Access your flashcards any time from any device. Study on the go
                with ease.
              </Typography>
            </Grid>
          </Grid>
          </Container>
        </Box>

        {/* Pricing section */}
        <Box sx={{ backgroundColor: "#353535", py: 4 }}>
          <Container>
            <PricingPlans/>
          </Container>
        </Box>
    </Box>
  );
}
