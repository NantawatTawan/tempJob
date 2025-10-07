import express from "express";
import postedJobRoute from "./routes/posted-job.route";
import cors from "cors";
import bodyParser from "express";
import jobTypeRouter from "./routes/job-types.route";
import companyRouter from "./routes/company.route";
import adminRouter from "./routes/admin.route";
import packageRouter from "./routes/package.route";
import userInfoRouter from "./routes/user-info.route";
import themeRouter from "./routes/theme.route";
import educationLevelRouter from "./routes/education-level.route";
import advertisementRouter from "./routes/advertisement.route";
import educationMajorRouter from "./routes/education-major.route";
import subscriptionRouter from "./routes/subscription.route";
import freelancerRouter from "./routes/freelancer.route";
import bookmarkedJobRouter from "./routes/bookmarked-job.route";
import paymentRouter from "./routes/payment.route";

const port = process.env.PORT || 8003;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use("/posted-jobs", postedJobRoute);
app.use("/job-types", jobTypeRouter);
app.use("/company", companyRouter);
app.use("/admin", adminRouter);
app.use("/packages", packageRouter);
app.use("/user-info", userInfoRouter);
app.use("/themes", themeRouter);
app.use("/education-levels", educationLevelRouter);
app.use("/advertisements", advertisementRouter);
app.use("/education-majors", educationMajorRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/freelancer", freelancerRouter);
app.use("/bookmarked-jobs", bookmarkedJobRouter);
app.use("/payment", paymentRouter);

app.listen(port, () => {
  console.log(`[INFO] : เซิร์ฟเวอร์ทำงานที่พอร์ต : ${port}`);
});
