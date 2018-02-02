import _ from 'lodash';
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
    // var data = [
    //     [1, "Denmark", 7.526, "Copenhagen"],
    //     [2, "Switzerland", 	7.509, "Bern"],
    //     [3, "Iceland", 7.501, "Reykjavík"],
    //     [4, "Norway", 7.498, "Oslo"],
    //     [5, "Finland", 7.413, "Helsinki"]
    // ];
    console.log(tableOne);
        var doc = new jsPDF();
    doc.autoTable(['',''], horizontal, {
      startY: 30,
      theme: 'grid',
      showHeader: 'never',
      columnStyles: {
        name: {textColor: 255, fontStyle: 'bold'}
      }
    });

    doc = renderDoc(doc, dataFase, columns);
    doc.save("dataurlnewwindow.pdf");
}

const objectToArray = (object, { porcentajeTotal, gramosTotal }) => {
  const returnArray = []
  _.map(object, (value, faseIndex) => {
    const newArray = _.map(value.ingrediente, (val, index) => {
      return [parseInt(faseIndex)+1, val.nombre, val.inci, val.funcion, val.porcentaje.toFixed(2), val.gramos];
    });
    newArray.push([parseInt(faseIndex)+1,"","","Total Fase",value.porcentajeFase, value.gramosFase]);
    newArray.map((value,index) => {
      returnArray.push(value);
    })
  });
  returnArray.push(["","","","Total",porcentajeTotal, gramosTotal])
  return returnArray;
}

const renderDoc = (doc, data, columns) => {
  let rowIndex = 1;
  let first = doc.autoTable.previous;
  doc.autoTable(columns, data, {
        theme: 'grid',
        startY: first.finalY + 10,
        drawRow: function (row, data) {
            // Colspan

            doc.setFontStyle('bold');
            doc.setFontSize(10);
            if (parseInt(row.raw[0]) === rowIndex){
              doc.setTextColor(0, 0, 0);
              doc.rect(data.settings.margin.left, row.y, data.table.width, 20, 'S');
              doc.autoTableText("Fase " + rowIndex, data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
                  halign: 'center',
                  valign: 'middle'
              });
              data.cursor.y += 10;
              rowIndex++;
            }
        }
    });
    return doc;
}
