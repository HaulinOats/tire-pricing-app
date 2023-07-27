import { ChangeEvent, useState } from "react";
import { read, utils } from "xlsx";
import { Sheet1 } from "../types/Sheet1.type";
import { TireSets } from "../types/TireSets.type";

interface FileUploadProps {
  getTireSets: (tireSets: TireSets) => void;
  getTireData: (tireData: Sheet1[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const [uploadMsg, setUploadMsg] = useState("");

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    const data = await file?.arrayBuffer();
    const workbook = read(data);

    let tireSets: any = {
      Model: [],
      Width: [],
      Profile: [],
      Diameter: []
    };

    let tireData: Sheet1[] = [];

    for (const sheet in workbook.Sheets) {
      let sheetArr: any = utils.sheet_to_json(workbook.Sheets[sheet]);
      switch (sheet) {
        case "sheet 1":
          for (let i = 0; i < sheetArr.length; i++) {
            tireData.push(sheetArr[i]);
            ["Model", "Width", "Profile", "Diameter"].forEach((key) => {
              if (sheetArr[i][key]) tireSets[key].push(sheetArr[i][key]);
            });
          }
          break;
        default:
      }
    }
    for (const key in tireSets) {
      tireSets[key] = Array.from(new Set(tireSets[key])).sort((a: any, b: any) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
    }
    props.getTireSets(tireSets);
    props.getTireData(tireData);
  };

  return (
    <form>
      <input type="file" onChange={(e) => uploadFile(e)} />
      {uploadMsg}
    </form>
  );
};

export default FileUpload;
