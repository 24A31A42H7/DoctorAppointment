import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-navbar">
        <div className="landing-logo">BOOK A DOCTOR</div>
        <div className="landing-nav-buttons">
          <button className="btn-primary" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>Register</button>
        </div>
      </nav>

      <div className="landing-hero">
        <div className="hero-image">
          <img
            src="https://img.freepik.com/free-photo/team-young-specialist-doctors-standing-corridor-hospital_1303-21199.jpg?w=740&t=st=1699000000~exp=1699000600~hmac=abc"
            alt="Doctors"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `
                <div style="width:420px;height:380px;background:linear-gradient(135deg,#b0c4c4,#8ba8a8);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:5rem;">👨‍⚕️</div>
              `;
            }}
          />
        </div>
        <div className="hero-content">
          <h1>Effortlessly schedule your doctor</h1>
          <p>appointments with just a few clicks,<br />putting your health in your hands.</p>
          <button className="btn-book" onClick={() => navigate('/register')}>Book your Doctor</button>
        </div>
      </div>
    </div>
  );
}
