import ImageContainer from "components/Imagecontainer/index";
import PDFViewer from "components/PdfViewerComponent";

const CheckModule = () => {
  return (
    <>
      <div>CheckModule</div>
      {/* <PDFViewer pdfUrl="/PROJECT REPORT.pdf" /> */}
      <div className="flex w-full flex-row">
        <div className="w-[10%]">
          <div>
            <img
              src="https://img.icons8.com/cotton/100/overview-pages-1.png"
              width={100}
              height={100}
            />
          </div>
          <div>
            <img src="https://img.icons8.com/cotton/100/overview-pages-1.png" />
          </div>
          <div>
            {" "}
            <img src="https://img.icons8.com/cotton/100/overview-pages-1.png" />
          </div>
          <div>
            {" "}
            <img src="https://img.icons8.com/cotton/100/overview-pages-1.png" />
          </div>
          <div>
            {" "}
            <img src="https://img.icons8.com/cotton/100/overview-pages-1.png" />
          </div>
          <div>
            {" "}
            <img src="https://img.icons8.com/cotton/100/overview-pages-1.png" />
          </div>
          <div>
            {" "}
            <img src="https://img.icons8.com/cotton/100/overview-pages-1.png" />
          </div>
          <div>
            {" "}
            <img src="https://img.icons8.com/cotton/100/overview-pages-1.png" />
          </div>
        </div>
        <div className="w-[60%]">
          <ImageContainer
            imageUrl={
              "https://res.cloudinary.com/dje269eh5/image/upload/v1722392010/omrimages/abcdvhjzvugmlqrxmofl.jpg"
            }
          />
        </div>
        <div className="w-[30%]"></div>
      </div>
    </>
  );
};

export default CheckModule;
