import React, { useState } from "react";
import { Button, Form, Row, Col, Container, Navbar } from "react-bootstrap";
import {
  createStyles,
  makeStyles,
  Theme,
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
} from "@material-ui/core";
import CopyrightIcon from "@material-ui/icons/Copyright";
import axios from "axios";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "bootstrap/dist/css/bootstrap.min.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    navbarcustom: {
      backgroundColor: "#808080",
      fontFamily: "Trebuchet MS",
      backgroundBlendMode: "lighten",
      height: "3.5rem",
    },
    navbarText: {
      textAlign: "center",
      justifyContent: "center",
      fontSize: "1.5rem",
    },
    footer: {
      marginTop: ".5rem 1rem",
      padding: "1rem",
      backgroundColor: "#000000",
      position: "fixed",
      bottom: "0",
      left: "0",
      width: "100%",
      justifyContent: "center",
      height: "1rem",
      fontSize: "1rem",
    },
    footerText: {
      color: "white",
      textAlign: "center",
      justifyContent: "center",
      fontSize: "0.75rem",
    },
  })
);

const App = () => {
  const styles = useStyles();
  const [lang, setLang] = useState("english");
  const [result, setResult] = useState<any>([]);
  const [text, setText] = useState("");
  const [dynamic, setDynamic] = useState(true);
  const clearData = () => {
    setText("");
    setResult([]);
  };
  const downloadData = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(result, null, 2)], {
      type: "text/plain;charset=utf-8",
    });
    element.href = URL.createObjectURL(file);
    element.download = "sample.json";
    document.body.appendChild(element);
    element.click();
  };
  const handleTextChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setText(event.target.value as string);
    if (dynamic) {
      axios
        .post("/recogniseEntities", {
          lang: lang,
          body: JSON.stringify(event.target.value as string, null, 2),
        })
        .then((response) => {
          setResult(response.data);
          console.log(response);
        });
    }
  };
  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setLang(event.target.value as string);
    setText("");
    setResult([]);
  };
  return (
    <div>
      <Navbar
        className="justify-content-center"
        variant="light"
        style={{
          backgroundColor: "#808080",
          fontFamily: "Trebuchet MS",
          backgroundBlendMode: "lighten",
          height: "2.5rem",
        }}
      >
        <Navbar.Brand href="#home" className={styles.navbarText}>
          <b>Named Entity Recognition</b>
        </Navbar.Brand>
      </Navbar>
      <br/>
      <div className="App">
        <Container>
          <Row>
            <Col xs={6}>
              <h4>&emsp;&emsp;Input Form for text to be processed</h4>
              <Row>
                <FormControl fullWidth={true}>
                  <InputLabel id="demo-simple-select-helper-label">
                    Language
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={lang}
                    onChange={handleSelectChange}
                    label="Language"
                  >
                    <MenuItem value={"english"}>English</MenuItem>
                    <MenuItem value={"french"}>French</MenuItem>
                    <MenuItem value={"spanish"}>Spanish</MenuItem>
                  </Select>
                  <FormHelperText>
                    Select the language of the text to be entered below!
                  </FormHelperText>
                </FormControl>
              </Row>
              <Row>
                <Form>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    <Form.Control
                      as="textarea"
                      value={text}
                      placeholder="Please enter text here"
                      style={{ height: "400px", width: "500px" }}
                      onChange={handleTextChange}
                    />
                  </Form.Group>
                </Form>
              </Row>
              <Row>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={dynamic === true}
                    onClick={async () => {
                      axios
                        .post("/recogniseEntities", {
                          lang: lang,
                          body: JSON.stringify(text, null, 2),
                        })
                        .then((response) => {
                          setResult(response.data);
                          console.log(response);
                        });
                    }}
                  >
                    Submit
                  </Button>{" "}
                  &nbsp;
                  <Button variant="danger" size="sm" onClick={clearData}>
                    Clear Data
                  </Button>
                </div>
              </Row>
            </Col>
            <Col xs={6}>
            <h4>&emsp;Named Entities grouped by Entity Type</h4>
              <br></br>
              <div
                className="ag-theme-alpine"
                style={{ height: 400, width: 500 }}
              >
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check
                      type="checkbox"
                      label="Dynamic (Check if NER needs to be carried out dynamically with change in input) "
                      onChange={() => setDynamic(!dynamic)}
                      checked={dynamic}
                    />
                  </Form.Group>
                </Form>
                <AgGridReact
                  animateRows={true}
                  rowData={result}
                  defaultColDef={{
                    editable: true,
                    sortable: true,
                    resizable: true,
                    filter: true,
                    flex: 1,
                    minWidth: 190,
                  }}
                >
                  <AgGridColumn
                    field="text"
                    sortable={true}
                    filter={true}
                  ></AgGridColumn>
                  <AgGridColumn
                    field="label"
                    sortable={true}
                    filter={true}
                    rowGroup={true}
                    hide={true}
                  ></AgGridColumn>
                </AgGridReact>
                <br></br>
                <Button
                  variant="success"
                  size="sm"
                  onClick={downloadData}
                  block
                >
                  Download as JSON
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <div>
        <Navbar className={styles.footer} variant="dark">
          <Navbar.Brand className={styles.footerText}>
            <CopyrightIcon style={{ fontSize: 15 }} /> Web-NER-Challenge
          </Navbar.Brand>
        </Navbar>
      </div>
    </div>
  );
};

export default App;
