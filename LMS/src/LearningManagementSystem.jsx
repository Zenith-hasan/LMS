import React, { useState, useEffect } from 'react';

// Main LMS Application
const LearningManagementSystem = () => {
  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Mock data - would be fetched from API in a real application
  useEffect(() => {
    // Simulate API fetch
    const fetchData = () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        role: "student"
      };

      const mockCourses = [
        {
          id: 101,
          title: "Introduction to React",
          description: "Learn the basics of React framework",
          instructor: "Jane Smith",
          modules: [
            {
              id: 1,
              title: "React Fundamentals",
              lessons: [
                { id: 1, title: "JSX Syntax", completed: true, content: "JSX is a syntax extension for JavaScript..." },
                { id: 2, title: "Components", completed: false, content: "Components are the building blocks of React applications..." }
              ]
            },
            {
              id: 2,
              title: "State and Props",
              lessons: [
                { id: 3, title: "Managing State", completed: false, content: "State represents..." },
                { id: 4, title: "Props Fundamentals", completed: false, content: "Props are properties passed to a component..." }
              ]
            }
          ],
          assignments: [
            { id: 1, title: "Build a Counter App", dueDate: "2025-03-10", submitted: false },
            { id: 2, title: "Todo List Application", dueDate: "2025-03-20", submitted: false }
          ],
          progress: 25
        },
        {
          id: 102,
          title: "Advanced JavaScript",
          description: "Deep dive into JavaScript concepts",
          instructor: "Mark Johnson",
          modules: [
            {
              id: 1,
              title: "Closures and Scope",
              lessons: [
                { id: 1, title: "Lexical Scope", completed: false, content: "Lexical scope means..." },
                { id: 2, title: "Closures Explained", completed: false, content: "A closure is..." }
              ]
            }
          ],
          assignments: [
            { id: 1, title: "Implement Currying", dueDate: "2025-03-15", submitted: false }
          ],
          progress: 0
        }
      ];

      setCurrentUser(mockUser);
      setCourses(mockCourses);
    };

    fetchData();
  }, []);

  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setCurrentView('courseDetail');
  };

  // Handle view changes
  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'dashboard') {
      setSelectedCourse(null);
    }
  };

  // Mark lesson as completed
  const markLessonCompleted = (lessonId) => {
    if (!selectedCourse) return;
    
    const updatedCourses = courses.map(course => {
      if (course.id === selectedCourse.id) {
        const updatedModules = course.modules.map(module => {
          const updatedLessons = module.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return { ...lesson, completed: true };
            }
            return lesson;
          });
          return { ...module, lessons: updatedLessons };
        });
        
        // Calculate new progress
        const allLessons = updatedModules.flatMap(module => module.lessons);
        const completedLessons = allLessons.filter(lesson => lesson.completed);
        const progress = Math.round((completedLessons.length / allLessons.length) * 100);
        
        const updatedCourse = { 
          ...course, 
          modules: updatedModules,
          progress: progress
        };
        setSelectedCourse(updatedCourse);
        return updatedCourse;
      }
      return course;
    });
    
    setCourses(updatedCourses);
  };

  // Submit assignment
  const submitAssignment = (assignmentId) => {
    if (!selectedCourse) return;
    
    const updatedCourses = courses.map(course => {
      if (course.id === selectedCourse.id) {
        const updatedAssignments = course.assignments.map(assignment => {
          if (assignment.id === assignmentId) {
            return { ...assignment, submitted: true };
          }
          return assignment;
        });
        
        const updatedCourse = { 
          ...course, 
          assignments: updatedAssignments
        };
        setSelectedCourse(updatedCourse);
        return updatedCourse;
      }
      return course;
    });
    
    setCourses(updatedCourses);
  };

  // Render different views based on current state
  const renderContent = () => {
    if (!currentUser) {
      return <LoginView onLogin={(user) => setCurrentUser(user)} />;
    }

    switch(currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            user={currentUser}
            courses={courses}
            onCourseSelect={handleCourseSelect}
          />
        );
      case 'courseDetail':
        return (
          <CourseDetail 
            course={selectedCourse}
            onBack={() => navigateTo('dashboard')}
            onLessonComplete={markLessonCompleted}
            onAssignmentSubmit={submitAssignment}
          />
        );
      case 'calendar':
        return <Calendar courses={courses} onBack={() => navigateTo('dashboard')} />;
      case 'profile':
        return <UserProfile user={currentUser} onBack={() => navigateTo('dashboard')} />;
      default:
        return <Dashboard user={currentUser} courses={courses} />;
    }
  };

  return (
    <div className="lms-container">
      {currentUser && (
        <Navbar 
          user={currentUser}
          currentView={currentView}
          onNavigate={navigateTo}
        />
      )}
      <main className="lms-main-content">
        {renderContent()}
      </main>
    </div>
  );
};

// Component for login view
const LoginView = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login - would be API call in real app
    onLogin({
      id: 1,
      name: "John Doe",
      email: email,
      role: "student"
    });
  };

  return (
    <div className="login-container">
      <h2>Learning Management System</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

// Navbar component
const Navbar = ({ user, currentView, onNavigate }) => {
  return (
    <nav className="lms-navbar">
      <div className="lms-logo">LMS System</div>
      <ul className="nav-items">
        <li className={currentView === 'dashboard' ? 'active' : ''}>
          <button onClick={() => onNavigate('dashboard')}>Dashboard</button>
        </li>
        <li className={currentView === 'calendar' ? 'active' : ''}>
          <button onClick={() => onNavigate('calendar')}>Calendar</button>
        </li>
        <li className={currentView === 'profile' ? 'active' : ''}>
          <button onClick={() => onNavigate('profile')}>Profile</button>
        </li>
      </ul>
      <div className="user-info">
        <span>{user.name}</span>
      </div>
    </nav>
  );
};

// Dashboard component
const Dashboard = ({ user, courses, onCourseSelect }) => {
  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}</h2>
      <div className="dashboard-summary">
        <div className="stats-card">
          <h3>Your Progress</h3>
          <p>{courses.length} Courses Enrolled</p>
        </div>
      </div>
      <h3>Your Courses</h3>
      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card" onClick={() => onCourseSelect(course)}>
            <h4>{course.title}</h4>
            <p>{course.description}</p>
            <div className="instructor">Instructor: {course.instructor}</div>
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${course.progress}%` }}></div>
            </div>
            <div className="progress-text">{course.progress}% Completed</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Course Detail component
const CourseDetail = ({ course, onBack, onLessonComplete, onAssignmentSubmit }) => {
  const [activeTab, setActiveTab] = useState('content');
  const [currentLesson, setCurrentLesson] = useState(null);

  if (!course) return <div>No course selected</div>;

  const handleLessonClick = (lesson) => {
    setCurrentLesson(lesson);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'content':
        return (
          <div className="course-content">
            <div className="modules-list">
              {course.modules.map(module => (
                <div key={module.id} className="module">
                  <h4>{module.title}</h4>
                  <ul>
                    {module.lessons.map(lesson => (
                      <li 
                        key={lesson.id} 
                        className={`lesson ${lesson.completed ? 'completed' : ''} ${currentLesson && currentLesson.id === lesson.id ? 'active' : ''}`}
                        onClick={() => handleLessonClick(lesson)}
                      >
                        {lesson.title}
                        {lesson.completed && <span className="check-mark">✓</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="lesson-content">
              {currentLesson ? (
                <>
                  <h3>{currentLesson.title}</h3>
                  <div className="content-body">
                    {currentLesson.content}
                  </div>
                  {!currentLesson.completed && (
                    <button 
                      className="complete-button"
                      onClick={() => onLessonComplete(currentLesson.id)}
                    >
                      Mark as Completed
                    </button>
                  )}
                </>
              ) : (
                <div className="select-lesson-prompt">
                  Select a lesson to begin learning
                </div>
              )}
            </div>
          </div>
        );
      case 'assignments':
        return (
          <div className="assignments">
            <h3>Course Assignments</h3>
            <table className="assignments-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {course.assignments.map(assignment => (
                  <tr key={assignment.id}>
                    <td>{assignment.title}</td>
                    <td>{assignment.dueDate}</td>
                    <td>{assignment.submitted ? 'Submitted' : 'Pending'}</td>
                    <td>
                      {!assignment.submitted ? (
                        <button 
                          className="submit-button"
                          onClick={() => onAssignmentSubmit(assignment.id)}
                        >
                          Submit
                        </button>
                      ) : 'Completed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'discussions':
        return (
          <div className="discussions">
            <h3>Course Discussions</h3>
            <p>This feature is coming soon!</p>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="course-detail">
      <button className="back-button" onClick={onBack}>←Back to Dashboard</button>
      <div className="course-header">
        <h2>{course.title}</h2>
        <div className="instructor">Instructor: {course.instructor}</div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${course.progress}%` }}></div>
        </div>
        <div className="progress-text">{course.progress}% Completed</div>
      </div>
      <div className="course-tabs">
        <button 
          className={`tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content
        </button>
        <button 
          className={`tab ${activeTab === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button 
          className={`tab ${activeTab === 'discussions' ? 'active' : ''}`}
          onClick={() => setActiveTab('discussions')}
        >
          Discussions
        </button>
      </div>
      <div className="tab-content">
        {renderContent()}
      </div>
    </div>
  );
};

// Calendar component for assignment due dates
const Calendar = ({ courses, onBack }) => {
  // Combine all assignments from all courses
  const allAssignments = courses.flatMap(course => 
    course.assignments.map(assignment => ({
      ...assignment,
      courseName: course.title
    }))
  );

  // Sort by due date
  const sortedAssignments = [...allAssignments].sort((a, b) => 
    new Date(a.dueDate) - new Date(b.dueDate)
  );

  return (
    <div className="calendar">
      <button className="back-button" onClick={onBack}>←Back to Dashboard</button>
      <h2>Upcoming Deadlines</h2>
      {sortedAssignments.length > 0 ? (
        <table className="calendar-table">
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Course</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedAssignments.map((assignment, index) => (
              <tr key={index}>
                <td>{assignment.title}</td>
                <td>{assignment.courseName}</td>
                <td>{assignment.dueDate}</td>
                <td>{assignment.submitted ? 'Submitted' : 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No upcoming deadlines!</p>
      )}
    </div>
  );
};

// User Profile component
const UserProfile = ({ user, onBack }) => {
  return (
    <div className="user-profile">
      <button className="back-button" onClick={onBack}>←Back to Dashboard</button>
      <h2>Your Profile</h2>
      <div className="profile-card">
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
        <div className="profile-actions">
          <button className="edit-profile-button">Edit Profile</button>
          <button className="change-password-button">Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default LearningManagementSystem;