import "./BodyContent.css";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth-context";
import config from "../utils/config.json";
import { Document, Page, pdfjs } from "react-pdf";
import CertificatesList from "./BodyComponents/CertificatesList";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function BodyContent(props) {
  const auth = useContext(AuthContext);
  const [sidebarName, setsideBarName] = useState();
  const [pdfString, setPdfString] = useState("");
  const [pages, setPages] = useState([]);
  const [isLoaded, setIsLoaded] = useState();

  const onDocumentLoadSuccess = ({ numPages }) => {
    let pagess = [];
    for (let i = 1; i <= numPages; i++) {
      pagess.push(i);
    }
    setPages(pagess);
  };

  /* useEffect(() => {
    if (sidebarName && itemtype === "Documents") {
      const requestBody = {
        documentId: sidebarName,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        body: JSON.stringify(requestBody),
      };
      fetch(config.SERVER.URL + "/api/resources/requestHandler", requestOptions)
        .then((response) => response.blob())
        .then((blob) => {
          let base64String;

          let reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            base64String = reader.result;
            setPdfString(base64String.substr(base64String.indexOf(",") + 1));
            setIsLoaded(true);
          };
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [props.sidebar]);
*/
  return (
    <div onContextMenu={(e) => e.preventDefault()} className="body-content">
      {/*sidebarName && isLoaded ? (
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
          ) : null*/}
      <CertificatesList certificateslist={props.certificateslist} />
    </div>
  );
}
