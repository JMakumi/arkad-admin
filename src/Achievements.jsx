// Achievements.js
import React from 'react';
import { useParams } from 'react-router-dom';
import achievementsData from './achievementData'

const Achievements = () => {
  const { id } = useParams();
  const achievement = achievementsData.find((item) => item.id === parseInt(id));

  return (
    <section className="bg-white py-12 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#006D5B] mb-8">Our Success Story</h2>
        {achievement ? (
          <div className="flex justify-center">
            <div className="w-full md:w-1/2 p-4 bg-white text-black rounded-lg shadow-lg mx-4 my-4" style={{ minHeight: "400px" }}>
              <div className="flex flex-col items-center justify-center mb-4 space-y-4">
                {achievement.activitiesImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Activity"
                    className="rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-125"
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                  />
                ))}
              </div>
              <p className="text-lg mb-2 font-semibold" style={{ fontSize: "1.125rem", color: "#333" }}>{achievement.description}</p>
              <p className="mb-2 text-sm font-medium" style={{ color: "#2D3748" }}><strong>Venue:</strong> {achievement.venue}</p>
              <p className="mb-2 text-sm font-light" style={{ color: "#4A5568" }}><strong>Date:</strong> {achievement.date}</p>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-500">Achievement not found</p>
        )}
      </div>
    </section>
  );
};

export default Achievements;
