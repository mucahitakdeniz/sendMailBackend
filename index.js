/* eslint-disable no-undef */
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

require("dotenv").config();
const mail = process.env?.mail;
const password = process.env?.password;
const PORT = process.env?.PORT;

// CORS middleware'i ekleyin
app.use(cors());

// Middleware for parsing JSON data
app.use(express.json());

app.post("/sendmail", (req, res) => {
  const { name, email, company, message } = req.body;

  const isEmailValidated = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
    email
  );
  if (name) {
    if (email) {
      if (company) {
        if (message) {
          if (isEmailValidated) {
            try {
              let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: mail,
                  pass: password,
                },
              });

              // Compose the email
              let mailOptions = {
                from: email, // Changed from: mail
                to: mail,
                subject: "New Contact Form Submission",
                text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nMessage: ${message}`,
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
            res.errorStatusCode = 403;
            throw new Error(
              " Email is not available. Please enter an available email "
            );
          }
        } else {
          res.errorStatusCode = 400;
          throw new Error("Message required ");
        }
      } else {
        res.errorStatusCode = 400;
        throw new Error("Company required ");
      }
    } else {
      res.errorStatusCode = 400;
      throw new Error("Email required ");
    }
  } else {
    res.errorStatusCode = 400;
    throw new Error("Name required ");
  }
});

//errorHandler
app.use(require("./errorHandler"));

// Start the server
app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server is running on port ${PORT}`);
});
