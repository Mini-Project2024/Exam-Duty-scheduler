import React from 'react'
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

export const SidebarData = [
    {
        title: "Assign Duty",
        icon: <AssignmentTurnedInOutlinedIcon/>,
        link: "/main/assignduty"
    },
    {
        title: "Display Faculty Details",
        icon: <PeopleAltOutlinedIcon/>,
        link: "/main/facultydetails"
    },
    {
        title: "Add Faculty Details",
        icon: <PersonAddIcon/>,
        link: "/main/addFaculty"
    },
    {
        title: "Add Exam Dates",
        icon: <EventAvailableIcon/>,
        link: "/main/examDates"
    },
   
];
