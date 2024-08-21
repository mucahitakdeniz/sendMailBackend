/* eslint-disable no-undef */
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

require("dotenv").config();
const myEmail = process.env?.EMAIL;
const password = process.env?.PASSWORD;
const PORT = process.env.PORT || 8000;

// Middleware for parsing JSON data

app.post("/sendmail", (req, res) => {
  const { name, email, message } = req.body;

  const isEmailValidated = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    email
  );
  if (name) {
    if (email) {
      if (message) {
        if (isEmailValidated) {
          try {
            let transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: myEmail,
                pass: password,
              },
            });

            // Compose the email
            let mailOptions = {
              from: myEmail,
              to: myEmail,
              subject: "New Contact Form Submission",
              text: `Name: ${name}\n Email: ${email} \n Message: ${message}`,
            };

            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log("ERROR", error);
                res.errorStatusCode = 500;
                throw new Error(" Internal server error ");
              } else {
                console.log("SUCCESS", info);
                res
                  .status(200)
                  .json({ message: "Form submitted successfully" });
              }
            });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
          }
        } else {
          res.status(403).json({ error: "Invalid email address" });
          return;
        }
      } else {
        res.status(400).json({ error: "Message required" });
        return;
      }
    } else {
      res.status(400).json({ error: "Email required" });
      return;
    }
  } else {
    res.status(403).json({ error: "Name required" });
    return;
  }
});

app.all("/", (req, res) => {
  res.status(200).json({ message: "It is running" });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
