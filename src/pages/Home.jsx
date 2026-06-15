import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ReviewCard from "../components/ReviewCard";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <Hero />

      <div className="grid md:grid-cols-3 gap-6 p-8">
        <ReviewCard
          title="Sentiment Analysis"
          description="Classify reviews as Positive, Neutral, or Negative."
          buttonText="Learn More"
        />

        <ReviewCard
          title="Theme Detection"
          description="Identify key topics such as Food, Host, Location, and Cleanliness."
          buttonText="Learn More"
        />

        <ReviewCard
          title="AI Response Suggestions"
          description="Generate professional responses for guest reviews using AI."
          buttonText="Learn More"
        />
      </div>

      <Footer />
    </>
  );
}