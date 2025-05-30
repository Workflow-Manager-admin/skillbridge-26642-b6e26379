import React, { useState } from "react";
import "./App.css";
import "./App-skillbridge.css";

/**
 * PUBLIC_INTERFACE
 * Main container for SkillBridge - Skill Gap Analyzer.
 * Provides features: Skill Assessment, Job Path Selection, Gap Analysis, Recommendations, Progress Tracking.
 */
function App() {
  // Demo jobs/career paths and required skills (in real app, fetch from API)
  const JOBS = [
    {
      title: "Frontend Developer",
      description: "Build beautiful and interactive user interfaces.",
      requiredSkills: [
        "JavaScript",
        "React",
        "CSS",
        "HTML",
        "Version Control (Git)",
        "Testing",
        "REST APIs"
      ]
    },
    {
      title: "Data Analyst",
      description: "Analyze and visualize data to drive decision making.",
      requiredSkills: [
        "Python",
        "SQL",
        "Data Visualization",
        "Statistics",
        "Excel",
        "Data Cleaning"
      ]
    },
    {
      title: "Project Manager",
      description: "Lead teams to deliver successful projects.",
      requiredSkills: [
        "Project Planning",
        "Communication",
        "Agile",
        "Risk Management",
        "Leadership",
        "Budgeting"
      ]
    }
  ];

  // Demo learning resources for skills (in real app, fetch from API)
  const LEARNING_RESOURCES = {
    "React": [
      {
        name: "React Official Docs",
        url: "https://react.dev/",
        type: "Documentation"
      },
      {
        name: "Build a React App (Codecademy)",
        url: "https://www.codecademy.com/learn/react-101",
        type: "Course"
      }
    ],
    "Python": [
      {
        name: "Python for Everybody (Coursera)",
        url: "https://www.coursera.org/specializations/python",
        type: "Course"
      },
      {
        name: "Official Python Docs",
        url: "https://docs.python.org/3/tutorial/",
        type: "Documentation"
      }
    ],
    "Project Planning": [
      {
        name: "Intro to Project Management (edX)",
        url: "https://www.edx.org/learn/project-management",
        type: "Course"
      }
    ]
    // ...etc
  };

  // React State
  const [currentSkills, setCurrentSkills] = useState([]);
  const [inputSkill, setInputSkill] = useState("");
  const [targetJobIdx, setTargetJobIdx] = useState(null);
  const [progressSkills, setProgressSkills] = useState({}); // { skillName: 0-100 }
  const [showAssessmentMsg, setShowAssessmentMsg] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    let skill = inputSkill.trim();
    if (skill !== "" && !currentSkills.includes(skill)) {
      setCurrentSkills([...currentSkills, skill]);
      setInputSkill("");
      setShowAssessmentMsg(false);
    }
  };

  const handleRemoveSkill = (skill) => {
    setCurrentSkills(currentSkills.filter((s) => s !== skill));
    setShowAssessmentMsg(false);
  };

  const handleJobSelect = (e) => {
    setTargetJobIdx(e.target.value !== "" ? parseInt(e.target.value, 10) : null);
    setShowAssessmentMsg(false);
  };

  // Compute gap analysis
  const gapSkills =
    targetJobIdx !== null
      ? JOBS[targetJobIdx].requiredSkills.filter(
          (skill) => !currentSkills.includes(skill)
        )
      : [];

  const matchedSkills =
    targetJobIdx !== null
      ? JOBS[targetJobIdx].requiredSkills.filter((skill) =>
          currentSkills.includes(skill)
        )
      : [];

  // Progress: tracked only for missing skills
  const handleProgressChange = (skill, value) => {
    setProgressSkills({ ...progressSkills, [skill]: value });
  };

  // Render
  return (
    <div className="sb-app">
      <SkillBridgeHeader />
      <main className="sb-main-container">
        <div className="sb-content-wrap">
          {/* Left Column: Inputs */}
          <section className="sb-input-column">
            <SkillAssessment
              skills={currentSkills}
              inputSkill={inputSkill}
              setInputSkill={setInputSkill}
              addSkill={handleAddSkill}
              removeSkill={handleRemoveSkill}
              showAssessmentMsg={showAssessmentMsg}
              setShowAssessmentMsg={setShowAssessmentMsg}
            />
            <JobPathSelect
              jobs={JOBS}
              targetJobIdx={targetJobIdx}
              onChange={handleJobSelect}
            />
          </section>
          {/* Right Column: Results */}
          <section className="sb-results-column">
            <GapAnalysis
              targetJobIdx={targetJobIdx}
              jobs={JOBS}
              matchedSkills={matchedSkills}
              gapSkills={gapSkills}
            />
            <Recommendations
              gapSkills={gapSkills}
              learningResources={LEARNING_RESOURCES}
            />
            <ProgressTracker
              gapSkills={gapSkills}
              progressSkills={progressSkills}
              updateProgress={handleProgressChange}
            />
          </section>
        </div>
      </main>
      <footer className="sb-footer">
        <span>
          &copy; {new Date().getFullYear()} SkillBridge &mdash; Advance Your Career 🚀
        </span>
      </footer>
    </div>
  );
}

// ===================== Subcomponents =============================

// Header
function SkillBridgeHeader() {
  return (
    <nav className="sb-navbar">
      <span className="sb-navbar-title sb-accent">
        <span role="img" aria-label="bridge" className="sb-header-icon">🌉</span> SkillBridge
      </span>
      <span className="sb-header-secondary">Skill Gap Analyzer</span>
    </nav>
  );
}

// Skill Assessment
function SkillAssessment({
  skills,
  inputSkill,
  setInputSkill,
  addSkill,
  removeSkill,
  showAssessmentMsg,
  setShowAssessmentMsg
}) {
  return (
    <div className="sb-card sb-card-input">
      <h2 className="sb-section-title">Skill Assessment</h2>
      <p className="sb-section-desc">Enter your current skills (e.g., "React", "Python"):</p>
      <form
        className="sb-skill-form"
        onSubmit={(e) => {
          addSkill(e);
          setShowAssessmentMsg(true);
        }}
      >
        <input
          className="sb-input"
          type="text"
          value={inputSkill}
          onChange={(e) => setInputSkill(e.target.value)}
          placeholder="Add a skill..."
          autoFocus
        />
        <button type="submit" className="sb-btn sb-btn-accent">
          Add
        </button>
      </form>
      <div className="sb-skills-list">
        {skills.map((skill) => (
          <span key={skill} className="sb-pill">
            {skill}
            <button className="sb-pill-remove" title="Remove Skill" onClick={() => removeSkill(skill)}>
              &times;
            </button>
          </span>
        ))}
        {skills.length === 0 && (
          <span className="sb-skill-placeholder">No skills added yet.</span>
        )}
      </div>
      {showAssessmentMsg && skills.length > 0 && (
        <div className="sb-assessment-confirmation">Skills updated!</div>
      )}
    </div>
  );
}

// Job/Career Path Selection
function JobPathSelect({ jobs, targetJobIdx, onChange }) {
  return (
    <div className="sb-card sb-card-input">
      <h2 className="sb-section-title">Career Path Selection</h2>
      <p className="sb-section-desc">
        Select your desired job or career path to compare required skills.
      </p>
      <select className="sb-select" value={targetJobIdx !== null ? targetJobIdx : ""} onChange={onChange}>
        <option value="">-- Select a Job/Career Path --</option>
        {jobs.map((job, idx) => (
          <option key={job.title} value={idx}>
            {job.title}
          </option>
        ))}
      </select>
      {targetJobIdx !== null && (
        <div className="sb-job-desc">
          <strong>Description:</strong>{" "}
          <span>{jobs[targetJobIdx].description}</span>
        </div>
      )}
    </div>
  );
}

// Gap Analysis
function GapAnalysis({ targetJobIdx, jobs, matchedSkills, gapSkills }) {
  if (targetJobIdx === null) {
    return (
      <div className="sb-card sb-analysis-card sb-card-empty">
        <h2 className="sb-section-title">Gap Analysis</h2>
        <div className="sb-section-desc">Please select a job/career path to see skill gap analysis.</div>
      </div>
    );
  }
  return (
    <div className="sb-card sb-analysis-card">
      <h2 className="sb-section-title">Gap Analysis</h2>
      <p className="sb-section-desc">
        <span className="sb-highlight">{matchedSkills.length}</span> /{" "}
        <span className="sb-highlight">{jobs[targetJobIdx].requiredSkills.length}</span> job skills matched
      </p>
      <div className="sb-gap-section">
        <div>
          <strong className="sb-match-label">Matched:</strong>
          <div className="sb-matched-list">
            {matchedSkills.length === 0 && (
              <span className="sb-skill-placeholder">No skills matched yet.</span>
            )}
            {matchedSkills.map((skill) => (
              <span key={skill} className="sb-pill sb-pill-matched">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <strong className="sb-gap-label">Missing:</strong>
          <div className="sb-gap-list">
            {gapSkills.length === 0 && (
              <span className="sb-skill-placeholder">No missing skills — all matched!</span>
            )}
            {gapSkills.map((skill) => (
              <span key={skill} className="sb-pill sb-pill-missing">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Recommendations (for missing skills)
function Recommendations({ gapSkills, learningResources }) {
  if (gapSkills.length === 0) {
    return null;
  }
  return (
    <div className="sb-card sb-card-recommend">
      <h2 className="sb-section-title">Personalized Recommendations</h2>
      <p className="sb-section-desc">
        Recommended learning resources for your missing skills:
      </p>
      <div className="sb-resource-list">
        {gapSkills.map((skill) => (
          <div key={skill} className="sb-resource-card">
            <div className="sb-resource-title">
              <span className="sb-resource-skill">{skill}</span>
            </div>
            {learningResources[skill] ? (
              <ul className="sb-resource-links">
                {learningResources[skill].map((res) => (
                  <li key={res.url}>
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="sb-resource-link">
                      {res.name}
                      <span className="sb-resource-type">[{res.type}]</span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="sb-skill-placeholder">No resources found.</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Progress Tracker (for missing skills)
function ProgressTracker({ gapSkills, progressSkills, updateProgress }) {
  if (gapSkills.length === 0) return null;
  return (
    <div className="sb-card sb-card-progress">
      <h2 className="sb-section-title">Progress Tracking</h2>
      <p className="sb-section-desc">
        Track your progress as you acquire new skills:
      </p>
      <div className="sb-progress-list">
        {gapSkills.map((skill) => (
          <div key={skill} className="sb-progress-item">
            <span className="sb-progress-skill">{skill}</span>
            <ProgressBar
              value={progressSkills[skill] || 0}
              onChange={(v) => updateProgress(skill, v)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Progress bar component
function ProgressBar({ value, onChange }) {
  return (
    <div className="sb-progress-bar-wrap">
      <input
        type="range"
        className="sb-progress-range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Skill Progress"
      />
      <div className="sb-progress-bar">
        <div
          className="sb-progress-bar-fill"
          style={{ width: `${value}%` }}
        ></div>
      </div>
      <span className="sb-progress-value">{value}%</span>
    </div>
  );
}

export default App;
