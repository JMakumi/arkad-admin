import React, { useEffect, useState } from 'react';
import happy from './images/happy.jpg';
import future from './images/future.jpg';
import impact from './images/impact.jpg';
import team from './images/team.jpg';
import memories from './images/memories.jpg';

const Home = () => {
  const images = [
    { src: happy, message: 'Let us cherish the happy moments we create through our actions and continue to spread joy in everything we do.' },
    { src: future, message: 'The future is bright. Let us persist in our pursuit for a better tomorrow, driven by hope and determination.' },
    { src: impact, message: 'Every effort we make leaves a mark. Together, we create a lasting impact for the betterment of the Arkad Family.' },
    { src: team, message: 'United we stand. As a strong and united team, we can achieve the vision of the Arkad Family.' },
    { src: memories, message: 'Our past is filled with fond memories. These stories propel us to continue the work we do, driven by passion and purpose.' },
  ];

  // Randomly select a background image and its corresponding message on component load
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setSelectedImage(randomImage);
  }, []);

  if (!selectedImage) return null; // Avoid rendering if no image is selected

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${selectedImage.src})` }}
    >
      <div className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg max-w-lg text-center">
        <p className="text-2xl font-bold mb-4">
          {selectedImage.message}
        </p>
        <p className="font-semibold">
          Your journey here begins with a commitment to growth and a passion for making a difference.
        </p>
      </div>
    </div>
  );
};

export default Home;
