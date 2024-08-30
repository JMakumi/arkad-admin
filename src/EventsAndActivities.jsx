import React, { useState } from 'react';
import Support from './partners/Support';
import Modal from './Modal';
import Volunteer from './Volunteer';
import children from './images/children.jpg';
import home from './images/home.jpg';

const EventsAndActivities = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [actionType, setActionType] = useState(null);

  const events = [
    {
      id: 1,
      image: children,
      description: 'Tree Planting Event at Karura Forest',
      venue: 'Karura Forest, Nairobi',
      date: '2024-09-15',
    },
    {
      id: 2,
      image: home,
      description: 'Children’s Home Visit and Donations',
      venue: 'New Life Home, Kiambu',
      date: '2024-10-10',
    },
    {
      id: 3,
      image: children,
      description: 'Youth Mentorship Retreat',
      venue: 'Naivasha, Kenya',
      date: '2024-11-20',
    },
  ];

  const handleParticipate = (event) => {
    setSelectedEvent(event);
  };

  const handleAction = (type) => {
    setActionType(type);
  };

  const renderActionComponent = () => {
    switch (actionType) {
      case 'donate':
        return <Support />;
      case 'volunteer':
        return <Volunteer />;
      default:
        return null;
    }
  };

  const handleSetReminder = (event) => {
    const { description, venue, date } = event;
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 2); // Assume a default duration of 2 hours

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      description
    )}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, '')}/${endDate
      .toISOString()
      .replace(/-|:|\.\d+/g, '')}&details=${encodeURIComponent(
      `Join us at ${venue} for the event: ${description}.`
    )}&location=${encodeURIComponent(
      venue
    )}&trp=true&reminder=%7B"method"%3A"popup"%2C"minutes"%3A10080%7D&reminder=%7B"method"%3A"popup"%2C"minutes"%3A4320%7D&reminder=%7B"method"%3A"popup"%2C"minutes"%3A720%7D`;

    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl font-bold text-[#006D5B] mb-8 text-center">Upcoming Events and Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white shadow-lg rounded-lg p-4">
            <img
              src={event.image}
              alt={event.description}
              className="w-full h-40 object-cover rounded-lg mb-4 transform transition-transform hover:scale-105"
            />
            <h3 className="text-xl font-semibold mb-2">{event.description}</h3>
            <p className="text-gray-600 mb-2">{event.venue}</p>
            <p className="text-gray-600 mb-4">{event.date}</p>
            <button
              onClick={() => handleParticipate(event)}
              className="bg-[#006D5B] text-white px-4 py-2 rounded-md mb-2 mr-2 transform transition-transform hover:scale-105"
            >
              Participate
            </button>
            <button
              onClick={() => handleSetReminder(event)}
              className="bg-[#FFD700] text-black px-4 py-2 rounded-md transform transition-transform hover:scale-105"
            >
              Set Reminder
            </button>
          </div>
        ))}
      </div>

      {/* Modal for Participation */}
      <Modal isOpen={!!selectedEvent} onClose={() => setSelectedEvent(null)}>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">How would you like to participate?</h3>
          <button
            onClick={() => handleAction('volunteer')}
            className="bg-[#006D5B] text-white px-6 py-3 rounded-md mb-4 mr-2 transform transition-transform hover:scale-105"
          >
            Volunteer
          </button>
          <button
            onClick={() => handleAction('donate')}
            className="bg-[#FFD700] text-black px-6 py-3 rounded-md transform transition-transform hover:scale-105"
          >
            Donate
          </button>
        </div>
      </Modal>

      {/* Render the Action Component */}
      <Modal isOpen={!!actionType} onClose={() => setActionType(null)}>
        {renderActionComponent()}
      </Modal>
    </div>
  );
};

export default EventsAndActivities;
