
# NoteSpace <img src="https://img.shields.io/badge/status-dev-blue" alt="Status" />

NoteSpace is a modern, lightweight, and secure note-taking application designed for seamless text sharing and temporary storage. Built with Next.js and MongoDB, it offers a clean, distraction-free environment for creating, editing, and sharing notes instantly.

## 🚀 Features

-   **Instant Note Creation**: Create notes instantly without sign-up.
-   **Auto-Save**: Your work is saved automatically as you type.
-   **Security**: Password protect your notes for privacy.
-   **Sharing**: Share notes via a unique link, social media, or specific platforms like WhatsApp and LinkedIn.
-   **Self-Destruct**: Notes that are empty or unused for a set period (e.g., 5 minutes) are automatically deleted.
-   **Custom URLs**: Create memorable custom URLs for your notes.
-   **Theme Support**: Toggle between Light and Dark modes.
-   **Responsive Design**: Optimized for both desktop and mobile devices.

## 🛠️ Tech Stack

-   **Frontend**: [Next.js](https://nextjs.org/) (React), Tailwind CSS, Framer Motion
-   **Backend**: Next.js API Routes
-   **Database**: MongoDB (Mongoose)
-   **Icons**: Lucide React, React Icons

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Techplement-dev/NoteSpace-dev.git
    cd NoteSpace-dev
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root directory and add your MongoDB connection string:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open the app**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
