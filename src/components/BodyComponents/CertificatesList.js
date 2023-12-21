import "./CertificatesList.css";
import { Document, Page, pdfjs } from "react-pdf";
import { useContext, useEffect, useState } from "react";
import { TableWithBrowserPagination, Column, Button, Spinner, Card, Modal, } from "react-rainbow-components";
import { AuthContext } from "../../context/auth-context";
import config from "../../utils/config.json";
import CustomSearch from "../UI/CustomSearch";

const CertificatesList = (props) => {
  const [isLoaded, setIsLoaded] = useState(true);
  const auth = useContext(AuthContext);
  const [filteredCertificates, setFilteredCertificates] = useState();
  const [pdfString, setPdfString] = useState("");
  const [pages, setPages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filename, setFileName] = useState();
  const [pdf, setPdf] = useState();

  const onDocumentLoadSuccess = ({ numPages }) => {
    let pagess = [];
    for (let i = 1; i <= numPages; i++) {
      pagess.push(i);
    }
    setPages(pagess);
  };
  const handleOnClose = () => {
    setIsOpen(false);
  };

  const certificateViewHandler = (value) => {

    setFileName(value);

    const requestBody = {
      fileName: value,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + auth.token,
      },
      body: JSON.stringify(requestBody),
    };

    fetch(config.CustomerPortal.URL + "/api/certificate/download", requestOptions)
      .then((response) => response.blob())
      .then((blob) => {
        let base64String;

        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          base64String = reader.result;
          setPdf(base64String);
          setPdfString(base64String.substr(base64String.indexOf(",") + 1));
          setIsLoaded(true);
          setIsOpen(true);
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const ViewCertificate = ({ value }) => (
    <Button
      variant="neutral"
      label="View"
      onClick={() => certificateViewHandler(value)}
    />
  );

  const DownloadCertificate = ({ value }) => (
    <a className="download__link" download={filename} href={pdf}>
      Download
    </a>
  );
  return (
    <div className="Certificates_page">
      {props.certificateslist ? (
        <Card>
          <div className="Certificates__container">

            <div className="searchers__container">
              <div className="searchers">
                <CustomSearch
                  options={props.certificateslist}
                  onfilter={(v) => setFilteredCertificates(v)}
                  filterby="name"
                  label="Search By Item Name"
                />
              </div>
              <div className="searchers">
                <CustomSearch
                  options={props.certificateslist}
                  onfilter={(v) => setFilteredCertificates(v)}
                  filterby="srfNo"
                  label="Search By SRF Number"
                />
              </div>
              <div className="searchers">
                <CustomSearch
                  options={props.certificateslist}
                  onfilter={(v) => setFilteredCertificates(v)}
                  filterby="make"
                  label="Search By Make"
                />
              </div>
              <div className="searchers">
                <CustomSearch
                  options={props.certificateslist}
                  onfilter={(v) => setFilteredCertificates(v)}
                  filterby="model"
                  label="Search By Model"
                />
              </div>
              <div className="searchers">
                <CustomSearch
                  options={props.certificateslist}
                  onfilter={(v) => setFilteredCertificates(v)}
                  filterby="serialno"
                  label="Search By Serial Number"
                />
              </div>
              <div className="searchers">
                <CustomSearch
                  options={props.certificateslist}
                  onfilter={(v) => setFilteredCertificates(v)}
                  filterby="idno"
                  label="Search By Id Number"
                />
              </div>
            </div>

            <TableWithBrowserPagination
              className="Certificates__table"
              pageSize={10}
              data={
                filteredCertificates
                  ? filteredCertificates
                  : props.certificateslist
              }
              keyField="sno"
              maxColumnWidth={300}
            >
              <Column header="Name" field="name" />
              <Column header="SRF Number" field="srfNo" />
              <Column header="Make" field="make" />
              <Column header="Model" field="model" />
              <Column header="Serial Number" field="serialno" />
              <Column header="Id Number" field="idno" />
              <Column
                header="View Certificate"
                field="filename"
                component={ViewCertificate}
              />
              <Column
                header="Download Certificate"
                field="filename"
                component={DownloadCertificate}
              />
            </TableWithBrowserPagination>
            {!isLoaded ? <Spinner size="medium" /> : null}
          </div>
        </Card>
      ) : null}

      {pdfString ? (
        <Modal
          isOpen={isOpen}
          onRequestClose={handleOnClose}
          size="large"
          className="certificate__modal"
        >
          <Document
            file={`data:application/pdf;base64,${pdfString}`}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {pages.map((page) => (
              <>
                <p className="pagenumber">{page}</p>
                <Page size="A4" pageNumber={page}></Page>
              </>
            ))}
          </Document>
        </Modal>
      ) : null}
    </div>
  );
};

export default CertificatesList;
