import React from 'react';
import '../styles/explore.css';



const ExplorePage = () => {
  
  const apps = [
  {
    appName: "Netflix",
    image: "/images/netflix.jpg",  // No need for ../ or relative path
    link: "/subscriptions/netflix"
  },
  {
    appName: "Amazon Prime",
    image: "/images/amazon-prime.jpg",
    link: "/subscriptions/amazon-prime"
  },
  {
    appName: "Disney+",
    image: "/images/disney+.jpg",
    link: "/subscriptions/disneyplus"
  },
  {
    appName: "YouTube Premium",
    image: "/images/youtube-premium.jpg",
    link: "/subscriptions/youtubepremium"
  },
  {
    appName: "Spotify",
    image: "/images/spotify.jpg",
    link: "/subscriptions/spotify"
  },
  {
    appName: "Slack",
    image: "/images/slack.jpg",
    link: "/subscriptions/slack"
  }
];

  return (
    <div className="explore-page">
      <h2>Explore Our Subscription Applications</h2>
      <div className="apps-container">
        {apps.map((app, index) => (
          <div key={index} className="app-card">
            <img src={app.image} alt={app.appName} className="app-image" />
            <h3>{app.appName}</h3>
            <a href={app.link} className="explore-link">Explore</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
