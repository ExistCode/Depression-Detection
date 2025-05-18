// pages/Contact.js
import React from 'react';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import './Contact.css';
import ronaldPic from '../assets/profile-pics/ronald-pic.png';
import benPic from '../assets/profile-pics/ben-pic.jpeg';
import hansPic from '../assets/profile-pics/hans-pic.jpeg';
import chuanzhePic from '../assets/profile-pics/chuanzhe-pic.jpeg';
import charliePic from '../assets/profile-pics/charlie-pic.jpeg';
import sumathiPic from '../assets/profile-pics/sumathi-pic.jpeg';


const Contact = () => {
  const teamMembers = [
    {
      name: "Bonifacio Ronald",
      role: "Group Leader & Front-End Developer",
      image: ronaldPic,
      linkedin: "https://linkedin.com/in/bonifacio-ronald",
      github: "https://github.com/bonifacioronald",
      email: "bonifacio.ronald@sd.taylors.edu.my"
    },
    {
      name: "Benjamin Tan Wei Keong",
      role: "Security & Back-End Engineer",
      image: benPic,
      linkedin: "https://www.linkedin.com/in/benjamin-tan1115/",
      github: "https://github.com/ben1115123",
      email: "benjaminweikeong.tan@sd.taylors.edu.my"
    },
    {
      name: "Gregorius Hans Andreanto",
      role: "Lead Data Engineer",
      image: hansPic,
      linkedin: "https://www.linkedin.com/in/hansandreanto/",
      github: "https://github.com/ExistCode",
      email: "gregoriushans.andreanto@sd.taylors.edu.my"
    },
    {
      name: "Lim Chuan Zhe",
      role: "Data Engineer",
      image: chuanzhePic,
      linkedin: "https://www.linkedin.com/in/ehz-nauhc8020/",
      github: "https://github.com/ehznauhcmil",
      email: "chuanzhe.lim@sd.taylors.edu.my"
    },
    {
      name: "Richard Charlie Cahyono",
      role: "Machine Learning / AI Engineer",
      image: charliePic,
      linkedin: "https://www.linkedin.com/in/richard-charlie-91684427b/",
      github: "https://github.com/CharlieCheebay",
      email: "richardcharlie.cahyono@sd.taylors.edu.my"
    },
  ];

  return (
    <div className="contact-container">
      <section className="contact-hero">
        <h1>Meet Our Team</h1>
        <p className="project-info">
          DARWIN: Depression Analysis and Recognition With Intelligent Networks
        </p>
        <div className="project-details">
          <p>Developed as part of the Capstone Project Module</p>
          <p>Taylor's University • 2024-2025</p>
        </div>
      </section>

      <section className="team-section">
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div className="team-card" key={index}>
              <div className="card-content">
                <div className="member-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p className="role">{member.role}</p>
                <div className="social-links">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                    <FaLinkedin />
                  </a>
                  <a href={member.github} target="_blank" rel="noopener noreferrer">
                    <FaGithub />
                  </a>
                  <a href={`mailto:${member.email}`}>
                    <FaEnvelope />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="supervisor-section">
        <h2>Project Supervisor</h2>
        <div className="supervisor-card">
          <div className="supervisor-image">
            <img src={sumathiPic} alt="Supervisor Name" />
          </div>
          <div className="supervisor-info">
            <h3>Ts.Sumathi Balakrishnan </h3>
            <p className="title">Senior Lecturer</p>
            <p className="department">School of Computer Science</p>
            <p className="university">Taylor's University</p>
            <a href="mailto:sumathi.balakrishnan@taylors.edu.my" className="contact-button">
              Contact Supervisor
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;