import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

const IndexPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-6">
      <img
        src="/logo.png"
        alt="Mathlify Logo"
        className="w-40 h-40 mb-8 rounded-3xl shadow-lg"
      />

      {/* Heading */}
      <h1 className="text-4xl font-extrabold text-primary text-center">
        Welcome to <span className="text-accent">Mathlify</span>
      </h1>

      {/* Description */}
      <p className="text-lg text-muted-foreground text-center mt-4 max-w-lg">
        Elevate your mental math skills with engaging challenges, real-time
        battles, and rewarding achievements!
      </p>

      {/* Call to Action */}
      <Link to="/auth/signup" className={cn(buttonVariants(),"mt-6 px-8 text-lg font-semibold transition-all duration-200 hover:scale-105")}>
        Get Started
      </Link>
    </div>
  );
};

export default IndexPage;
