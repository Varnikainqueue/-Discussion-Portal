import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("discussion-questions")) || [];
    } catch {
      return [];
    }
  });

  const [selectedId, setSelectedId] = useState(null);
  const [title, setTitle] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "discussion-questions",
      JSON.stringify(questions)
    );
  }, [questions]);

  const selectedQuestion =
    questions.find((q) => q.id === selectedId) || null;

  function addQuestion(e) {
    e.preventDefault();

    const newQuestion = {
      id: crypto.randomUUID(),
      title: title.trim(),
      question: questionText.trim(),
      answers: [],
      resolved: false,
      createdAt: new Date().toLocaleString(),
    };

    setQuestions((prev) => [newQuestion, ...prev]);
    setSelectedId(newQuestion.id);
    setTitle("");
    setQuestionText("");
  }

  function addAnswer(e) {
    e.preventDefault();

    const newAnswer = {
      id: crypto.randomUUID(),
      name: name.trim(),
      comment: comment.trim(),
      createdAt: new Date().toLocaleString(),
    };

    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selectedId
          ? { ...q, answers: [...q.answers, newAnswer] }
          : q
      )
    );

    setName("");
    setComment("");
  }

  function toggleResolved() {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selectedId ? { ...q, resolved: !q.resolved } : q
      )
    );
  }

  const filteredQuestions = questions.filter((q) =>
    `${q.title} ${q.question}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand-icon">D</div>
        <div>
          <h1>Discussion Portal</h1>
          <p>Ask questions. Share knowledge. Learn together.</p>
        </div>
        <span className="question-count">
          {questions.length} {questions.length === 1 ? "Question" : "Questions"}
        </span>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-heading">
            <div>
              <h2>All Questions</h2>
              <p>Explore the community discussions</p>
            </div>
            <span className="count-badge">{questions.length}</span>
          </div>

          <input
            className="search-input"
            type="search"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="new-question-button"
            onClick={() => {
              setSelectedId(null);
              setTitle("");
              setQuestionText("");
            }}
          >
            + New Question
          </button>

          <div className="question-list">
            {filteredQuestions.length === 0 ? (
              <div className="empty-list">
                <span>💬</span>
                <h3>No questions yet</h3>
                <p>Start a discussion and it will appear here.</p>
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <button
                  key={q.id}
                  className={`question-card ${
                    selectedId === q.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedId(q.id)}
                >
                  <div className="question-card-top">
                    <h3>{q.title}</h3>
                    {q.resolved && (
                      <span className="resolved-tag">Resolved</span>
                    )}
                  </div>
                  <p>{q.question}</p>
                  <div className="question-meta">
                    <span>
                      {q.answers.length}{" "}
                      {q.answers.length === 1 ? "answer" : "answers"}
                    </span>
                    <span>View discussion →</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="main-panel">
          {!selectedQuestion ? (
            <div className="form-container">
              <div className="section-icon">✦</div>
              <span className="eyebrow">START A CONVERSATION</span>
              <h2>What's on your mind?</h2>
              <p className="section-description">
                Share a question with the community and get helpful answers.
              </p>

              <form onSubmit={addQuestion}>
                <label htmlFor="title">Question Title *</label>
                <input
                  id="title"
                  type="text"
                  placeholder="e.g. How does localStorage work?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  maxLength={120}
                />

                <label htmlFor="question">Describe your question *</label>
                <textarea
                  id="question"
                  placeholder="Explain your question in detail..."
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  required
                  rows={6}
                />

                <button className="primary-button" type="submit">
                  Post Question →
                </button>
              </form>
            </div>
          ) : (
            <div className="discussion-container">
              <button
                className="back-button"
                onClick={() => setSelectedId(null)}
              >
                ← Back to new question
              </button>

              <div className="discussion-header">
                <span className="eyebrow">QUESTION DETAILS</span>
                <h2>{selectedQuestion.title}</h2>
                <p className="question-body">
                  {selectedQuestion.question}
                </p>
                <p className="timestamp">
                  Posted {selectedQuestion.createdAt}
                </p>

                <div className="resolve-row">
                  <span
                    className={
                      selectedQuestion.resolved
                        ? "status resolved-status"
                        : "status open-status"
                    }
                  >
                    {selectedQuestion.resolved
                      ? "✓ Resolved"
                      : "● Open discussion"}
                  </span>

                  <button
                    className="resolve-button"
                    onClick={toggleResolved}
                  >
                    {selectedQuestion.resolved
                      ? "Reopen Question"
                      : "Resolve"}
                  </button>
                </div>
              </div>

              <div className="answers-section">
                <h3>
                  Previous Answers
                  <span className="count-badge">
                    {selectedQuestion.answers.length}
                  </span>
                </h3>

                {selectedQuestion.answers.length === 0 ? (
                  <p className="no-answers">
                    No answers yet. Be the first to respond!
                  </p>
                ) : (
                  selectedQuestion.answers.map((answer) => (
                    <article className="answer-card" key={answer.id}>
                      <div className="avatar">
                        {answer.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="answer-content">
                        <div className="answer-heading">
                          <strong>{answer.name}</strong>
                          <span>{answer.createdAt}</span>
                        </div>
                        <p>{answer.comment}</p>
                      </div>
                    </article>
                  ))
                )}
              </div>

              {!selectedQuestion.resolved && (
                <div className="response-form-container">
                  <h3>Add Your Response</h3>
                  <p>Have an idea? Share it with the community.</p>

                  <form onSubmit={addAnswer}>
                    <label htmlFor="name">Your Name *</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      maxLength={80}
                    />

                    <label htmlFor="comment">Your Comment *</label>
                    <textarea
                      id="comment"
                      placeholder="Write your answer..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      rows={4}
                    />

                    <button className="primary-button" type="submit">
                      Submit Response →
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <footer>
        Discussion Portal <span>•</span> Built with React
      </footer>
    </main>
  );
}

export default App;

