const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

/*Resident Data */
const residentsProfileRoutes = require("./routes/residentsProfileRoutes");
const residentPhotoRoutes = require("./routes/residentsProfilePhotoRoutes");

/*Non Resident Data*/
const nonResidentsProfileRoutes = require("./routes/nonResidentsProfileRoutes");
const nonResidentsPhotoRoutes = require("./routes/nonResidentsProfilePhotoRoutes");

/*Dropdown Master Data */
const hawBloodTypesroutes = require("./routes/hawBloodTypesRoutes");
const hawServicesRoutes = require("./routes/hawServicesRoutes");
const hrisCivilStatusRouter = require("./routes/hrisCivilStatusRoutes");
const hrisGenderRouter = require("./routes/hrisGenderRoutes");
const hrisNationalitiesRouter = require("./routes/hrisNationalitiesRoutes");
const hrisNamePrefixRouter = require("./routes/hrisNamePrefixRoutes");
const hrisNameSuffix = require("./routes/hrisNameSuffixRoutes");
const hrisIdTypesRouter = require("./routes/hrisIdTypesRoutes");

/* GIS/Address Dropdown */
const gisRegionsRouter = require("./routes/gisRegionsRoutes");
const gisProvinceRouter = require("./routes/gisProvinceRoutes");
const gisMunicipalityRouter = require("./routes/gisMunicipalityRoutes");
const gisBarangayRouter = require("./routes/gisBarangayRoutes");
const gisSubdivisionRouter = require("./routes/gisSubdivisionRoutes");
const gisStreetsRouter = require("./routes/gisStreetsRoutes");

// Accounts
const authRoutes = require("./routes/accountRoutes");
const usersRoutes = require("./routes/userRoutes");

// Resident Profile Summary
const dashboardSummaryRoutes = require("./routes/residentProfileSummaryRoutes");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // 👈 FRONTEND ORIGIN
    credentials: true, // 👈 ALLOW COOKIES
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(express.json()); // Parse JSON bodies

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    env: process.env.NODE_ENV || "development",
  });
});

// Routes
////Resident Data
app.use("/api/residentsProfile", residentsProfileRoutes);
app.use("/api/residentsProfile", residentPhotoRoutes);

// Non Resident Data
app.use("/api/nonResidentsProfile", nonResidentsProfileRoutes);
app.use("/api/nonResidentsProfile", nonResidentsPhotoRoutes);

////Dropdown Master Data
app.use("/api/bloodtypes", hawBloodTypesroutes);
app.use("/api/services", hawServicesRoutes);
app.use("/api/civil_status", hrisCivilStatusRouter);
app.use("/api/gender", hrisGenderRouter);
app.use("/api/nationalities", hrisNationalitiesRouter);
app.use("/api/suffix", hrisNameSuffix);
app.use("/api/prefix", hrisNamePrefixRouter);
app.use("/api/idtypes", hrisIdTypesRouter);

////GIS/Address Dropdown
app.use("/api/regions", gisRegionsRouter);
app.use("/api/province", gisProvinceRouter);
app.use("/api/municipality", gisMunicipalityRouter);
app.use("/api/barangay", gisBarangayRouter);
app.use("/api/subdivisions", gisSubdivisionRouter);
app.use("/api/streets", gisStreetsRouter);

app.use("/api/users", usersRoutes);

//Resident Profile Summary
app.use("/api/dashboard", dashboardSummaryRoutes);

// Accounts
app.use("/api/auth", authRoutes);

// JWT Tokens

module.exports = app;
