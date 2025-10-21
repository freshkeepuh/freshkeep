import React from 'react';

interface WelcomeSectionProps {
  title: string;
  subtitle: string;
}

/**
 * WelcomeSection component to display a welcome message.
 * @param param0 - Props containing title and subtitle.
 * @returns JSX.Element
 */
const WelcomeSection: React.FC<WelcomeSectionProps> = ({ title, subtitle }) => (
  <div className="welcome-section justify-content-center">
    <h1 className="welcome-title">{title}</h1>
    <h2 className="welcome-subtitle">{subtitle}</h2>
  </div>
);

export default WelcomeSection;
