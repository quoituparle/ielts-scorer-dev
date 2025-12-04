<div align="center">

  <h1>BANDSENSE</h1>
  
  <p>
    <strong>Your AI-Powered IELTS Examiner. Instant Feedback, Precise Scoring.</strong>
  </p>

  <p>
    <a href="https://bandsense.vercel.app/home">Live Demo</a> •
    <a href="https://github.com/quoituparle/bandsense">Backend Repository</a> •
  </p>

  ![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square)
  ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square)
  ![Starlette](https://img.shields.io/badge/Admin-Starlette-important?style=flat-square)
  ![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

</div>

---

> **⚠️ Note to Visitors:** This repository houses the **Frontend (React)** source code. For the heavy lifting, AI logic, and API documentation, please visit **[https://github.com/quoituparle/bandsense]**([Link to Backend Repo]).

---
Try now : https://bandsense.vercel.app/home
---

## What is this?

IELTS writing is tough. The feedback loop is usually slow, expensive, or frustratingly vague. **[BANDSENSE]** solves this by bridging the gap between practice and precision.

We combine a modern, reactive interface with a high-performance Python backend to grade your essays in seconds, not days. But it's more than a calculator—it's a **Playground**. You can see what others are writing, understand why they got a Band 8.0 (or a Band 5.0), and analyze the scoring details to improve your own logic and vocabulary.


## ✨ Key Features

*   **Precision Scoring:** Not just random numbers. Our AI evaluates logical flow, vocabulary sophistication, and grammar to provide a realistic IELTS band score.
*   <img width="1887" height="862" alt="屏幕截图 2025-12-04 231916" src="https://github.com/user-attachments/assets/9c69b84c-ab11-4e4d-9873-9e5f3c906f5b" />

*   **The Playground:** A community hub where you can browse the latest essay topics and review essays shared by other users. Learn from the best (and the worst).


<img width="1896" height="867" alt="屏幕截图 2025-12-04 231939" src="https://github.com/user-attachments/assets/51b3b2a2-09bd-4d98-add9-29c6e7940546" />



<img width="1900" height="866" alt="屏幕截图 2025-12-04 232027" src="https://github.com/user-attachments/assets/0ddffa86-3381-4859-8311-286a13e06ef7" />


*   **Modern Security:** Built with robust **JWT (JSON Web Token)** authentication to keep your essays and data private.

*   **Insightful Details:** We don't just say "Good job." We provide a breakdown of scoring details so you know exactly where to improve.
  <img width="1887" height="862" alt="屏幕截图 2025-12-04 231916" src="https://github.com/user-attachments/assets/44eb264f-a0fb-4ff3-a549-74b60508c935" />

*   **Admin Power:** Managed via a **Starlette-based system**, ensuring content quality and efficient resource management.

<img width="1903" height="866" alt="屏幕截图 2025-12-04 232329" src="https://github.com/user-attachments/assets/b85f3670-3ac9-445e-9ded-1dc59cb9e148" />

## Tech Stack

We believe in choosing the right tool for the job.

| Component | Tech | Why? |
| :--- | :--- | :--- |
| **Frontend** | **React** | For a snappy, component-based UI that feels like a native app. |
| **Backend** | **FastAPI** | Because we need speed. It handles async AI inference effortlessly. |
| **Auth** | **JWT** | Stateless, secure, and industry-standard authentication. |
| **Admin** | **Starlette Admin** | Lightweight yet powerful management interface. |

## 🤝 Contributing

Got an idea to make IELTS less painful? PRs are welcome! Please make sure to check out the backend repo if your changes involve API logic.

---
