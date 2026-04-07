import "./BodyContent.css";

import { pdfjs } from "react-pdf";
import CertificatesList from "./BodyComponents/CertificatesList";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function BodyContent(props) {
  return (
    <div onContextMenu={(e) => e.preventDefault()} className="body-content">
      <CertificatesList certificateslist={props.certificateslist} />
    </div>
  );
}
