import "./SplashScreen.css";
import logo from "../assets/favicon.png";

function SplashScreen() {
  return (
    <div className="splash-screen">
      <img
        src={logo}
        alt="AI Test Intelligence"
        className="splash-logo"
      />

      <h3 className="welcome-text">
        Welcome to
      </h3>

      <h1 className="app-title">
        AI Test Intelligence
      </h1>

      <p className="tagline">
        Your Intelligent QA Assistant
      </p>

      <p className="signature">
        Designed &amp; Developed by <span>VK</span>
      </p>

      <div className="loader"></div>

      <p className="loading-text">
         Initializing AI Engine...
</p>
    </div>
    
  );
}

export default SplashScreen;