import {
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { RiFileList3Line } from "react-icons/ri";
import { BsPersonVcard } from "react-icons/bs";
import { MdOutlinePendingActions } from "react-icons/md";
import { MdMiscellaneousServices } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaUsersCog } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";

import { ROLES } from "./roles";

export const sidebarNav = [
  {
    label: "Analytics",
    icon: HiOutlineChartBarSquare,
    roles: [ROLES.ADMINISTRATOR],
  },

  {
    label: "Digital Logbook",
    icon: HiOutlineClipboardDocumentList,
    dropdownId: "logbook",
    roles: [
      ROLES.ADMINISTRATOR,
      ROLES.ID_PRINTER,
      ROLES.ENCODER,
      ROLES.REGISTRATION_STAFF,
      ROLES.COORDINATOR,
    ],
    children: [
      {
        label: "Patient's Profile",
        icon: BsPersonVcard,
        roles: [
          ROLES.ADMINISTRATOR,
          ROLES.ID_PRINTER,
          ROLES.ENCODER,
          ROLES.REGISTRATION_STAFF,
          ROLES.COORDINATOR,
        ],
      },
      {
        label: "Transactions",
        icon: RiFileList3Line,
        roles: [ROLES.ADMINISTRATOR, ROLES.ENCODER, ROLES.REGISTRATION_STAFF],
      },
      {
        label: "Backlogs",
        icon: MdOutlinePendingActions,
        roles: [ROLES.ADMINISTRATOR],
      },
    ],
  },

  {
    label: "Services",
    icon: MdMiscellaneousServices,
    roles: [ROLES.ADMINISTRATOR],
  },

  {
    label: "Account Management",
    icon: HiOutlineUserGroup,
    dropdownId: "accounts",
    roles: [
      ROLES.ADMINISTRATOR,
      ROLES.ID_PRINTER,
      ROLES.ENCODER,
      ROLES.REGISTRATION_STAFF,
      ROLES.COORDINATOR,
    ],
    children: [
      {
        label: "My Profile",
        icon: CgProfile,
        roles: [
          ROLES.ADMINISTRATOR,
          ROLES.ID_PRINTER,
          ROLES.ENCODER,
          ROLES.REGISTRATION_STAFF,
          ROLES.COORDINATOR,
        ],
      },
      {
        label: "Users",
        icon: FiUsers,
        roles: [ROLES.ADMINISTRATOR],
      },
    ],
  },

  {
    label: "About",
    icon: FaUsersCog,
    roles: [
      ROLES.ADMINISTRATOR,
      ROLES.ID_PRINTER,
      ROLES.ENCODER,
      ROLES.REGISTRATION_STAFF,
      ROLES.COORDINATOR,
    ],
  },
];
