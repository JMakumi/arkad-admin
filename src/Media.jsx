import React, { useState } from 'react';
import tree from './images/tree_planting.jpg';
import children from './images/happy_children.jpg';
import mentorship from './images/mentorship.jpg';

const mediaData = [
  {
    id: 1,
    image: children,
    description: 'Children enjoying a retreat organized by Arkad SMP.',
  },
  {
    id: 2,
    image: tree,
    description: 'Tree planting event at Karura Forest.',
  },
  {
    id: 3,
    image: mentorship,
    description: 'Youth mentorship session in Naivasha, Kenya.',
  },
  {
    id: 4,
    image: tree,
    description: 'Another tree planting event.',
  },
  {
    id: 5,
    image: children,
    description: 'More children enjoying the retreat.',
  },
];

const Media = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = window.innerWidth >= 768 ? 3 : 1; // 3 items per page on larger screens, 1 item on smaller screens
  const totalPages = Math.ceil(mediaData.length / itemsPerPage);

  const currentItems = mediaData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-[#006D5B] mb-8 text-center">Media Gallery</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="relative">
              <img
                src={item.image}
                alt={item.description}
                className="w-full h-60 object-cover transform transition-transform hover:scale-105"
              />
              <div
                className="absolute bottom-0 bg-white text-[#006D5B] px-4 py-2 rounded-t-lg"
                style={{
                  width: '80%', 
                  left: '10%', 
                }}
              >
                <p className="text-center text-sm">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <button
            key={pageIndex}
            onClick={() => goToPage(pageIndex)}
            className={`mx-2 px-4 py-2 rounded-full ${currentPage === pageIndex ? 'bg-[#FFD700] text-white' : 'bg-gray-300 text-gray-700'} transition-colors`}
          >
            {pageIndex + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Media;
