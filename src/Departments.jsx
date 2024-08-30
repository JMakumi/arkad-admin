import React from 'react';
import executive from "./images/executive.jpg";
import social from './images/social_impact.jpg';
import strategy from './images/strategy_and_growth.jpg';
import outreach from './images/public_outreach.jpg';
import environ from './images/environment_and_food.jpg';
import organizing from './images/organizing_technical_support.jpg';
import welfare from './images/welfare.jpg';
import information from './images/information_management.jpg';
import education from './images/education.jpg';

const departmentsData = [
  {
    name: "Arkad Executive Team",
    image: executive,
    description: "The decision-making body of Arkad, responsible for spearheading the organization's mission, allocating resources, and identifying growth opportunities.",
    roles: [
      "Spearhead the mission and vision.",
      "Allocate resources to departments.",
      "Address member and departmental views.",
      "Seek growth opportunities and partnerships."
    ]
  },
  {
    name: "Department of Social Impact (Arkad Mesocarp)",
    image: social,
    description: "This department champions Arkad’s social objectives, focusing on mentorship in parenting, education, talents, financial literacy, and spiritual awareness.",
    roles: [
      "Organize visits to children's homes, schools, and churches.",
      "Host seminars for youth, teens, and parents.",
      "Coordinate competitions and retreats for Arkad school clubs.",
      "Provide mentorship and coaching."
    ]
  },
  {
    name: "Department of Strategy and Growth",
    image: strategy,
    description: "Responsible for driving Arkad’s growth and building a network while focusing on establishing a Savings and Investment company for Africa's socioeconomic independence.",
    roles: [
      "Advise on investment opportunities.",
      "Maintain contact with partners.",
      "Support Arkad school clubs.",
      "Provide investment and financial literacy training."
    ]
  },
  {
    name: "Department of Public Outreach",
    image: outreach,
    description: "The marketing arm of Arkad, focusing on public awareness, communication, and expanding the organization's reach.",
    roles: [
      "Manage social media channels.",
      "Organize public awareness campaigns.",
      "Advertise events.",
      "Induct and train new members."
    ]
  },
  {
    name: "Department of Environment, Health, and Food Security",
    image: environ,
    description: "Focused on addressing climate change, global health challenges, and promoting sustainable practices in line with UN SDGs.",
    roles: [
      "Organize environmental campaigns.",
      "Educate on climate change and health.",
      "Promote green energy, medicine, and agriculture.",
      "Seek partnerships in climate and health initiatives."
    ]
  },
  {
    name: "Department of Organizing and Technical Support",
    image: organizing,
    description: "Ensures smooth coordination across departments and manages organizational resources and event logistics.",
    roles: [
      "Maintain and run Arkad office.",
      "Support event setup and logistics.",
      "Procure and maintain resources.",
      "Organize transportation for events."
    ]
  },
  {
    name: "Department of Welfare and Member’s Wellbeing",
    image: welfare,
    description: "Equivalent to HR, this department ensures member wellbeing, unity, and handles internal events and disciplinary issues.",
    roles: [
      "Address member needs and wellbeing.",
      "Foster unity among members.",
      "Organize internal events and awards.",
      "Handle disciplinary matters."
    ]
  },
  {
    name: "Department of Information Management, Science and Technology",
    image: information,
    description: "Leverages IT to position Arkad as a tech-driven institution, managing digital presence and training members in technology.",
    roles: [
      "Maintain online presence.",
      "Outsource internet technology.",
      "Train members in technology.",
      "Organize computer literacy training."
    ]
  },
  {
    name: "Department of Education and Talents Development",
    image: education,
    description: "Empowers youth with skills and talents to achieve their potential, focusing on innovation-driven learning and talent nurturing.",
    roles: [
      "Promote innovation-driven learning.",
      "Nurture talents through mentorship.",
      "Organize talents promotion events.",
      "Provide resources to nurture talents."
    ]
  }
];

const Departments = () => {
  return (
    <section className="bg-white py-12 px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#006D5B] mb-8">Our Departments</h2>
        <div className="flex flex-wrap justify-center">
          {departmentsData.map((dept, idx) => (
            <div key={idx} className="w-full md:w-1/3 p-4">
              <div
                className="bg-white shadow-lg rounded-lg p-6 transition-transform duration-300 ease-in-out transform hover:scale-105"
                style={{ borderTop: "5px solid #FFD700", minHeight: "400px" }}
              >
                <img
                  src={dept.image}
                  alt={dept.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  loading="lazy"
                />
                <h3 className="text-2xl font-semibold text-[#006D5B] mb-2">{dept.name}</h3>
                <p className="text-gray-700 text-lg mb-4">{dept.description}</p>
                <ul className="text-left text-gray-600">
                  {dept.roles.map((role, index) => (
                    <li key={index} className="mb-2 flex items-start">
                      <span className="mr-2 text-[#006D5B]">•</span>
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Departments;



