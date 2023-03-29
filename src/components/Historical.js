import React, { useState, useRef } from "react";
import data from "./data2.json"; // data should be multiples of number ,  4*5 or 6*7 , 5*12
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import { Divider, Typography, IconButton } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import "./Physical.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const totalItems = data.length;
const itemsPerPage = 9;

const Historical = () => {
  const [selectedButtonValues, setSelectedButtonValues] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const tableRef = useRef(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(itemsPerPage);
  const handleClick = (value) => {
    const newSelectedButtonValues = new Set(selectedButtonValues);
    if (selectedButtonValues.has(value)) {
      newSelectedButtonValues.delete(value);
    } else {
      newSelectedButtonValues.add(value);
    }
    setSelectedButtonValues(newSelectedButtonValues);
  };

  const count = (item) => {
    return Object.keys(item).filter((key) => key.startsWith("Historical signs")).length;
  };




  const createButtons = (item) => {
    const buttons = [];
     for (let i = 1; i <= count(item); i++) {
      const key = `Historical signs${i}`;
      const value = item[key];
      if (value) {
        buttons.push(
          <button
            key={key}
            onClick={() => handleClick(value)}
            className={selectedButtonValues.has(value) ? "selected" : ""}
          >
            {value}
          </button>
        );
      }
    }
    return buttons;
  };
  const renderData = data.slice(start, end).map((item, index) => {
    //const renderData = data.map((item, index) => {
    if (item["Neuraxis Level"]) {
      return (
        <div key={index}>
          <h2>{item["Neuraxis Level"]}</h2>
          {createButtons(item)}
        </div>
      );
    } else if (item["Neuraxis sublevel"]) {
      return (
        <div key={index}>
          <h3>{item["Neuraxis sublevel"]}</h3>
          {createButtons(item)}
        </div>
      );
    }
    return null;
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["#", " Historical Information"]],
      body: [...selectedButtonValues].map((value, index) => [index + 1, value]),
      startY: 20,
    });
    doc.save("selected-historical-signs.pdf");
  };

  
  const handleNext = () => {
    if (end + itemsPerPage >= totalItems ) {
      setStart(totalItems-itemsPerPage);
       setEnd(totalItems);
    }else
    {
  setStart(start + itemsPerPage);
  setEnd(end + itemsPerPage);
    }
};

const handlePrev = () => {
if (start - itemsPerPage <= 0 ) {
  setStart(0);
   setEnd(itemsPerPage);
}else
{
setStart(start - itemsPerPage);
setEnd(end - itemsPerPage);
}
};

  return (
    <div id="historical">
      <Grid mt={5} mb={5} container>
        <Grid item md={3}></Grid>
        <Grid item md={6}>
          <Typography
            variant="h3"
            sx={{
              justifyContent: "center",
              display: "flex",
              fontWeight: 900,
            }}
            className="heading"
          >
            {" "}
            Historical Findings Form{" "}
            <IconButton
              color="primary"
              edge="start"
              aria-label="logo"
              className="svg_icons"
            >
              <LocalHospitalIcon />
            </IconButton>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              justifyContent: "center",
              display: "flex",
              color: "#595959",
            }}
            className="subheading"
          >
            {" "}
            Please fill out this form so we can assess your findings.{" "}
          </Typography>
          <Accordion className="accordion">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              How to use
            </AccordionSummary>
            <AccordionDetails>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum
            </AccordionDetails>
          </Accordion>
          <br></br>
          <Divider></Divider>
          {renderData}
          <button onClick={handlePrev} disabled={start === 0}>
            Prev
          </button>
          <button onClick={handleNext} disabled={end >= totalItems}>
            Next
          </button>
          <div className="footer">
            <button onClick={() => setShowModal(true)}>View</button>
          </div>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Selected Historical Signs:</h2>
                <table ref={tableRef}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Historical Information</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...selectedButtonValues].map((value, index) => (
                      <tr key={value}>
                        <td>{index + 1}</td>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={exportPDF}>Export as PDF</button>
                <button onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          )}
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        </Grid>
        <Grid item md={3}></Grid>
      </Grid>
    </div>
  );
};

export default Historical;
