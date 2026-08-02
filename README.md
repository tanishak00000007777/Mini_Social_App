# Mini Social App
A simple full-stack social networking app built using Node.js, Express, MongoDB, EJS, and Tailwind CSS.

## Features
- User registration and login  
- Upload and display profile pictures using Multer  
- Create personal posts  
- Like and unlike posts  
- Session-based authentication  

## Technologies Used
- Node.js  
- Express.js  
- MongoDB  
- Mongoose  
- EJS  
- Tailwind CSS  
- Multer  

## How to Use
1. Clone the repository and install dependencies  
   `git clone https://github.com/tanishak0000007777/mini-social-app.git`  
   `cd mini-social-app`  
   `npm install`  

2. Ensure MongoDB is running locally (`mongodb://127.0.0.1:27017/miniproject`)  

3. Start the server  
   `node app.js`  

4. Open your browser and visit `http://localhost:3000`

## Project Structure
```
mini-social-app/
│── views/               # EJS templates (index, login, profile, upload)
│── models/
│   ├── user.js          # User schema and MongoDB connection
│   └── post.js          # Post schema
│── public/
│   └── images/uploads/  # Uploaded profile pictures
│── multer.js            # Multer file upload configuration
│── app.js               # Main Express server
```

## License
This project is open-source and free to use. Feel free to modify and enhance it!

## Author
Tanishak Bansal  
GitHub: https://github.com/tanishak0000007777
