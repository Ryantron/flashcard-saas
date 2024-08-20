'use client'
import { Box, Button, Grid, Typography } from "@mui/material";
import getStripe from "@/utils/get-stripe";

const handleSubmit = async () => {
  const checkoutSession = await fetch('/api/checkout_sessions', {
    method: 'POST',
    headers: { origin: 'http://localhost:3000' },
  });
  const checkoutSessionJson = await checkoutSession.json();
  
  if (checkoutSession.statusCode === 500) {
    console.error(checkoutSession.message);
    return;
  }

  const stripe = await getStripe()
  const { error } = await stripe.redirectToCheckout({
    sessionId: checkoutSessionJson.id,
  });

  if (error) {
    console.warn(error.message)
  }
}

const PricingPlans = () => (
  <Box sx={{ my: 6, textAlign: "center" }}>
    <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 6, color: 'white' }}>
      Pricing Plans
    </Typography>
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} md={4}>
        <Box>
          <Box
            sx={{
              p: 2,
              backgroundColor: "#3C6E71",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              boxShadow: 3,
              color: "white",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Basic
            </Typography>
          </Box>
          <Box 
            sx={{
              border: "1px solid",
              borderColor: "gray",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              backgroundColor: "#D9D9D9",
              boxShadow: 3,
              p: 5
            }}
          >
            <Typography variant="h6" gutterBottom>
              Free
            </Typography>
            <Typography gutterBottom>
              Access to basic flashcard features and limited storage.
            </Typography>
            <Button variant="contained" sx={{ mt: 2, backgroundColor: '#3C6E71', '&:hover': { backgroundColor: '#3C6E71' } }}>
              Choose Basic
            </Button>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} md={4}>
        <Box>
          <Box
            sx={{
              p: 2,
              backgroundColor: "#3C6E71",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              boxShadow: 3,
              color: "white",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Pro
            </Typography>
          </Box>
          <Box 
            sx={{
              border: "1px solid",
              borderColor: "gray",
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              backgroundColor: "#D9D9D9",
              boxShadow: 3,
              p: 5
            }}
          >
            <Typography variant="h6" gutterBottom>
              $5 / month
            </Typography>
            <Typography gutterBottom>
              Unlimited flashcards and storage, with priority support.
            </Typography>
            <Button variant="contained" sx={{ mt: 2, backgroundColor: '#3C6E71', '&:hover': { backgroundColor: '#3C6E71' } }} onClick={handleSubmit}>
              Choose Pro
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  </Box>
);

export default PricingPlans;
