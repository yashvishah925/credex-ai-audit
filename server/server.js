import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

/*
  TEST ROUTE
*/

app.get("/", (req, res) => {
  res.send("Credex AI Audit Backend Running");
});

/*
  SEND EMAIL
*/

app.post("/send-email", async (req, res) => {
  try {
    const { email, savings } = req.body;

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",

      to: email,

      subject: "Your Credex AI Audit Results",

      html: `
        <h2>Credex AI Spend Audit</h2>

        <p>Your audit has been completed.</p>

        <p>
          Estimated optimization opportunity:
          <strong>$${savings}/month</strong>
        </p>

        <p>
          Credex will reach out for high-savings cases.
        </p>
      `
    });

    res.status(200).json(data);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to send email"
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});