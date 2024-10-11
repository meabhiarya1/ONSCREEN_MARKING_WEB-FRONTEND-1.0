import ImageContainer from "components/Imagecontainer/index";
import PDFViewer from "components/PdfViewerComponent";

const CheckModule = () => {
  return (
    <>
      <div>CheckModule</div>
      {/* <PDFViewer pdfUrl="/PROJECT REPORT.pdf" /> */}
      <div className="flex w-full flex-row overflow-auto">
        <div className="h-[100vh] w-[10%] overflow-auto">
          <div>
            <img
              src="https://img.icons8.com/cotton/100/overview-pages-1.png"
              width={100}
              height={100}
              alt="icon"
            />
            <div>Q1-10</div>
          </div>
          <div>
            <img src="https://img.icons8.com/cotton/100/overview-pages-1.png" />
            <div>Q1-10</div>
          </div>
          <div>
            <img src="https://img.icons8.com/cotton/100/overview-pages-1.png" />
            <div>Q1-10</div>
          </div>
          <div>
            <img src="https://img.icons8.com/cotton/100/overview-pages-1.png" />
            <div>Q1-10</div>
          </div>
          <div>
            <img src="https://img.icons8.com/cotton/100/overview-pages-1.png" />
            <div>Q1-10</div>
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
