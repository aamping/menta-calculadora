import _ from 'lodash';
import { img } from './logo';
var jsPDF = require('jspdf');
require('jspdf-autotable');


export function generatePdf(tableOne, rawDataFase) {
    const { porcentajeTotal, gramosTotal } = tableOne;
    const columns = ["Fase", "Nombre Ingrediente", "INCI", "Función", "Porcentaje (%)", "Gramos (grs)"];
    const dataFase = objectToArray(rawDataFase, { porcentajeTotal, gramosTotal });
    let doc = new jsPDF();

    // doc.autoTable(['',''], horizontal, {
    //   startY: 50,
    //   theme: 'grid',
    //   showHeader: 'never',
    //   columnStyles: {
    //     name: {textColor: 255, fontStyle: 'bold'}
    //   },
    //   margin: {top: 30, right: 107}
    // });

    doc = renderDoc(doc, dataFase.data, columns, dataFase.ingLength, tableOne);
    doc.save(tableOne.titulo + ".pdf");
}

const objectToArray = (object, { porcentajeTotal, gramosTotal }) => {
  const returnArray = []
  const ingLength = []
  _.map(object, (value, faseIndex) => {
    ingLength[faseIndex] =  Object.keys(value.ingrediente).length;
    const newArray = _.map(value.ingrediente, (val, index) => {
      return [parseInt(faseIndex, 10)+1, val.nombre, val.inci, val.funcion, ((val.porcentaje ? val.porcentaje.toFixed(3) : val.porcentaje) +' %'), val.gramos + ' g'];
    });
    newArray.push([parseInt(faseIndex, 10)+1,"%?=","%?=-",("Total Fase " + (parseInt(faseIndex, 10)+1)),(value.porcentajeFase.toFixed(3)+ ' %'), value.gramosFase + ' g']);
    // newArray.push(["???-","","","","",""]);
    newArray.map((value,index) => {
      returnArray.push(value);
      return null;
    })
  });
  returnArray.push(["","%?=","%?=-","Total",(porcentajeTotal + ' %'), gramosTotal + ' g'])
  return { data: returnArray, ingLength};
}

const renderDoc = (doc, data, columns, ingLength, tableOne) => {
  const { titulo, referencia, fecha, pesoTotal } = tableOne;
  const horizontal = [
    ["Nombre de tu receta: "],
    ["Número de referencia: "],
    ["Fecha de producción: "],
    ["Peso Total: "],
  ];
  doc.setFontSize(10);
  doc.setFontStyle('bold');
  doc.text(horizontal[0], 14, 50);
  doc.setFontStyle('none');
  doc.setFontSize(10);
  doc.text(titulo, 51, 50);
  doc.setFontSize(10);
  doc.setFontStyle('bold');
  doc.text(horizontal[1], 14, 60);
  doc.setFontStyle('none');
  doc.setFontSize(10);
  doc.text(referencia, 49, 60);
  doc.setFontSize(10);
  doc.setFontStyle('bold');
  doc.text(horizontal[2], 14, 70);
  doc.setFontStyle('none');
  doc.setFontSize(10);
  doc.text(fecha, 48, 70);
  doc.setFontSize(10);
  doc.setFontStyle('bold');
  doc.text(horizontal[3], 14, 80);
  doc.setFontStyle('none');
  doc.setFontSize(10);
  doc.text(pesoTotal + ' g', 33, 80);
  const pageContent = (data) => {
         // HEADER
         doc.setFontSize(20);
         doc.setTextColor(40);
         doc.setFontStyle('normal');
         // toDataURL(
         //    '/media/menta-logo.jpeg',
         //    function(dataUrl) {
         //      doc.addImage(dataUrl, 'JPEG', data.settings.margin.left, 15, 10, 10);
         //      doc.text("Mentactiva", data.settings.margin.left + 15, 22);
         //    }
         //  )
         // imgToBase64('menta-logo.jpeg', function(base64) {
         //      base64Img = base64;
         //  });
         if (img) {
             doc.addImage(img, 'JPEG', data.settings.margin.left+33, 15, 124, 26);
         }
         // doc.text("Mentactiva", data.settings.margin.left + 15, 22);

         // FOOTER
         var str = "www.mentactiva.com";
         // Total page number plugin only available in jspdf v1.0+
         doc.setTextColor(70, 177, 152);
         doc.setFontSize(15);
         doc.text(str, 80, doc.internal.pageSize.height - 10);
  }
  let rowIndex = 1;
  let cellIndex = 1;
  let last = false;
  doc.autoTable(columns, data, {
        addPageContent: pageContent,
        theme: 'grid',
        startY: 90,
        drawRow: function (row, data) {
            doc.setFontStyle('bold');
            doc.setFontSize(10);
            if (row.raw[0] !== rowIndex ){
              // console.log("si");
              // doc.setTextColor(0, 0, 0);
              doc.rect(data.settings.margin.left, row.y, data.table.width, row.height, 'S');
              // doc.autoTableText("Fase " + rowIndex, data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
              //     halign: 'center',
              //     valign: 'middle'
              // });
              data.cursor.y += row.height;
              rowIndex++;
            }
        },
        drawCell: function (cell, data) {
          if (last) {
            doc.setFontStyle('bold');
          }
          const str = "Total Fase " + (cellIndex-1);
          if(cell.raw === str) {
            doc.setFontStyle('bold');
            doc.setFontSize(10);
          }
          if(cell.raw === "Total") {
            doc.setFontStyle('bold');
            doc.setFontSize(10);
            last = true;
            // doc.setTextColor(0, 0, 0);
          }
          if (cell.raw === "%?=") {
            doc.rect(cell.x, cell.y, cell.width+data.table.columns[2].width, cell.height, 'S');
            return false;
          }
          if (cell.raw === "%?=-") return false;
            if (data.column.dataKey === 0) {

                if (parseInt(cell.raw, 10) === cellIndex) {
                  doc.setFontStyle('bold');
                  doc.setFontSize(10);
                  doc.rect(cell.x, cell.y, data.table.width, cell.contentHeight * (ingLength[cellIndex-1]+1), 'S');
                  doc.autoTableText("Fase " + cellIndex, cell.x + cell.width / 2, cell.y + cell.height * (ingLength[cellIndex-1]+1) / 2, {
                      halign: 'center',
                      valign: 'middle'
                  });
                  cellIndex++;
                }
                return false;
            }

        }
    });
    return doc;
}
