import _ from 'lodash';
import { img } from './logo';
var jsPDF = require('jspdf');
require('jspdf-autotable');


export function generatePdf(tableOne, rawDataFase) {
    const { titulo, referencia, fecha, pesoTotal, porcentajeTotal, gramosTotal } = tableOne;
    const columns = ["Fase", "Nombre Ingrediente", "INCI", "Función", "Porcentaje (%)", "Gramos (grs)"];
    const horizontal = [
      ["Nombre de tu receta:", titulo],
      ["Número de referencia:", referencia],
      ["Fecha de producción:", fecha],
      ["Peso Total:", pesoTotal],
    ];
    const dataFase = objectToArray(rawDataFase, { porcentajeTotal, gramosTotal });
    let doc = new jsPDF();
    const pageContent = (data) => {
           // HEADER
           let base64Img = null;
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
            console.log(img);
           if (img) {
               doc.addImage(img, 'JPEG', data.settings.margin.left+40, 15, 124, 26);
           }
           // doc.text("Mentactiva", data.settings.margin.left + 15, 22);

           // FOOTER
           var str = "Página " + data.pageCount;
           // Total page number plugin only available in jspdf v1.0+
           if (typeof doc.putTotalPages === 'function') {
               str = str + " of " + totalPagesExp;
           }
           doc.setFontSize(10);
           doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);
    }
    // var data = [
    //     [1, "Denmark", 7.526, "Copenhagen"],
    //     [2, "Switzerland", 	7.509, "Bern"],
    //     [3, "Iceland", 7.501, "Reykjavík"],
    //     [4, "Norway", 7.498, "Oslo"],
    //     [5, "Finland", 7.413, "Helsinki"]
    // ];

    const totalPagesExp = "{total_pages_count_string}";
    // Total page number plugin only available in jspdf v1.0+

    doc.autoTable(['',''], horizontal, {
      startY: 50,
      addPageContent: pageContent,
      theme: 'grid',
      showHeader: 'never',
      columnStyles: {
        name: {textColor: 255, fontStyle: 'bold'}
      },
      margin: {top: 30, right: 107}
    });
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    doc = renderDoc(doc, dataFase.data, columns, dataFase.ingLength);
    doc.save(tableOne.titulo + ".pdf");
}

const objectToArray = (object, { porcentajeTotal, gramosTotal }) => {
  const returnArray = []
  const ingLength = []
  _.map(object, (value, faseIndex) => {
    ingLength[faseIndex] =  Object.keys(value.ingrediente).length;
    const newArray = _.map(value.ingrediente, (val, index) => {
      return [parseInt(faseIndex)+1, val.nombre, val.inci, val.funcion, (val.porcentaje.toFixed(2)+' %'), val.gramos + ' g'];
    });
    newArray.push([parseInt(faseIndex)+1,"%?=","%?=-",("Total Fase " + (parseInt(faseIndex)+1)),(value.porcentajeFase.toFixed(2)+ ' %'), value.gramosFase + ' g']);
    // newArray.push(["???-","","","","",""]);
    newArray.map((value,index) => {
      returnArray.push(value);
    })
  });
  returnArray.push(["","%?=","%?=-","Total",(porcentajeTotal.toFixed(2) + ' %'), gramosTotal] + 'g')
  return { data: returnArray, ingLength};
}

const renderDoc = (doc, data, columns, ingLength) => {
  let rowIndex = 1;
  let cellIndex = 1;
  let last = false;
  let first = doc.autoTable.previous;
  doc.autoTable(columns, data, {
        theme: 'grid',
        startY: first.finalY + 10,
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
          if(cell.raw === "Total Fase") {
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

                if (parseInt(cell.raw) === cellIndex) {
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

function toDataURL(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}


function imgToBase64(url, callback) {
    if (!window.FileReader) {
        callback(null);
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result.replace('text/xml', 'image/jpeg'));
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
}
