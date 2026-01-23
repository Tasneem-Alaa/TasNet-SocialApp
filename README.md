# TasNet - Next-Gen Social Networking Platform

**TasNet** is a high-performance, Full-Stack social media application built with the **MERN** stack. It offers a seamless, real-time user experience, focusing on community engagement through stories, instant messaging, and a dynamic feed.

🔗 **Live Demo : https://tasnet.vercel.app**

---

## ✨ Key Features

* **🔐 Advanced Authentication:** Secure user onboarding via **Clerk**, supporting Google OAuth and email/password flows.
* **📸 Story System:** Users can upload text, image, or video stories that disappear after 24 hours, powered by **Inngest** background jobs.
* **📱 Dynamic Smart Feed:** A personalized timeline displaying posts from followed users with full support for emojis and hashtags.
* **💬 Real-Time Messaging:** Instant chat functionality using **Server-Sent Events (SSE)** for a fluid communication experience.
* **👥 Social Graph:** Comprehensive follow/unfollow system with real-time friend requests and follower management.
* **📧 Smart Notifications:** Automated email reminders for pending requests or unread messages using **Nodemailer**.
* **🖼️ Media Optimization:** High-speed image and video processing and hosting via **ImageKit**.
* **🛠️ Customizable Profiles:** Elegant user profiles featuring editable bios, profile pictures, and cover photos.

---

## 🛠️ Tech Stack

### **Frontend**

* **React.js (Vite)** - For a lightning-fast development experience.
* **Redux Toolkit** - Robust state management.
* **Tailwind CSS** - Modern, responsive UI design.
* **Clerk** - Seamless Authentication & User Management.

### **Backend**

* **Node.js & Express.js** - Scalable server-side logic.
* **MongoDB & Mongoose** - Efficient NoSQL data modeling.
* **Inngest** - Reliable background job processing (CRON jobs for stories).
* **ImageKit** - Cloud-based media management.

---

## 📸 Screenshots Preview

| 🌐 Landing Page | 📱 User Feed |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/23421356-31be-4994-af7a-e4e4dce7e6dd" width="400" /> | <img width="400" alt="image" src="https://github.com/user-attachments/assets/23a16b65-4bab-4386-8da9-e84bcf785b4d" />|

| 👤 User Profile | ⚙️ Edit profile |
| :---: | :---: |
| <img width="400" alt="image" src="https://github.com/user-attachments/assets/92d6082d-2f6c-4611-8582-f14f9cd3cce6" /> | <img width="400" alt="image" src="https://github.com/user-attachments/assets/29dfcc2f-be4b-4263-b988-01e33b044301" /> |

| 💬 Chat System | 🎬 Stories UI |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/a54c69ba-1a79-4ac6-8b7a-99796eb0f833" width="400" /> | <img width="400" alt="image" src="https://github.com/user-attachments/assets/91541af7-6839-41a8-9fdd-28a41f4da5ec" /> |

---

## 🚀 Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/TasNet.git

```


2. **Install dependencies:**
```bash
# Install Client dependencies
cd client && npm install

# Install Server dependencies
cd ../server && npm install

```


3. **Environment Variables:**
Create a `.env` file in both directories and add your credentials for MongoDB, Clerk, ImageKit, and Inngest.
4. **Run the application:**
```bash
# Start Client
npm run dev

# Start Server
npm run server

```



---

## 🔗 Connect with me
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tasneem-alaa/)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)]()
