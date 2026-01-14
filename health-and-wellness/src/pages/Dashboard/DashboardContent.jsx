import React, { useState } from "react";

import Analytics from "../../components/Dashboard/Analytics";
import Transactions from "../../components/Dashboard/Digital Logbook/Transactions/Transactions";
import PatientsProfile from "../../components/Dashboard/Digital Logbook/Patient's Profile/PatientsProfile";
import Backlogs from "../../components/Dashboard/Backlogs";
import Services from "../../components/Dashboard/Services/Services";
import MyProfile from "../../components/Dashboard/Account Management/MyProfile";
import Users from "../../components/Dashboard/Account Management/Users/Users";
import AboutUs from "../../components/Dashboard/About";

const DashboardContent = ({ activeItem }) => {
  const componentMap = {
    Analytics: <Analytics />,
    "Patient's Profile": <PatientsProfile />,
    Transactions: <Transactions />,
    Backlogs: <Backlogs />,
    Services: <Services />,
    "My Profile": <MyProfile />,
    Users: <Users />,
    About: <AboutUs />,
  };

  return componentMap[activeItem] || <Analytics />;
};

export default DashboardContent;
