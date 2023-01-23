

function WriteTable (elem, htmlTable, node){

    for(i=0; i<Object.keys(elem).length;i++){
        const subNode = document.createElement("td");
        let textnode;
        textnode = document.createTextNode(elem[i]);
        subNode.appendChild(textnode);
        node.appendChild(subNode);
        htmlTable.appendChild(node);
    }
}

const cambioFecha = (date, quantity) => {
    let converted_date = new Date(Math.round((date - quantity) * 864e5));
    converted_date = String(converted_date).slice(4, 15);
    date = converted_date.split(" ");
    let day = date[1];
    let month = date[0];
    month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
    if (month.toString().length <= 1) {
        month = '0' + month;
    }
    let year = date[2];
    return String(day + '/' + month + '/' + year);
};

function cambioHora(excel_date, time = false) {
    let day_time = excel_date % 1
    let meridiem = "AMPM"
    let hour = Math.floor(day_time * 24)
    let minute = Math.floor(Math.abs(day_time * 24 * 60) % 60)
    let second = Math.floor(Math.abs(day_time * 24 * 60 * 60) % 60)
    hour >= 12 ? meridiem = meridiem.slice(2, 4) : meridiem = meridiem.slice(0, 2)
    hour > 12 ? hour = hour : hour = hour
    hour = hour < 10 ? "0" + hour : hour
    minute = minute < 10 ? "0" + minute : minute
    second = second < 10 ? "0" + second : second
    let daytime = "" + hour + ":" + minute + ":" + second
    return time ? daytime : daytime
};

function Limpiar (a, b){
    if (a.length > 0) {
        do {
            b.removeChild(a[0]);

        } while (a.length != 0);
    }
}

function TitleList (info, titleList, table ){
    const nodeP = document.createElement("tr");
    nodeP.classList.add(info);
            
        for (i=0; i<titleList.length; i++){
            let subNode = document.createElement("th");
            let textnode = document.createTextNode(titleList[i]);
            subNode.appendChild(textnode);
            nodeP.appendChild(subNode);
            }
        table.appendChild(nodeP);
}



function upload(source, func) {
    var files = document.getElementById(source).files;
    if (files.length == 0) {
        alert("Seleccione Archivo");
        return;
    }
    var filename = files[0].name;
    var extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == '.XLS' || extension == '.XLSX'|| extension == '.TXT') {
        func(files[0]);
    } else {
        alert("No se puede leer el archivo");
    }
}

let roa;

let tableP = document.getElementsByClassName("tabla");

let choferesPorLegajo = [];


function Func0(file) {
    try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(e) {

            var data = e.target.result;
            var workbook = XLSX.read(data, {type: 'binary'});
            workbook.SheetNames.forEach(function(sheetName) {
            roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

            if (roa.length > 0){
                for (const elem of roa){
                    choferesPorLegajo.push({legajo: elem.LEGAJO, chofer: elem.APELLIDO});
                }
                console.log(choferesPorLegajo);
            };
        })    

    }
    } catch (e) {
        console.error(e);
    }
}



let tableP72 = document.getElementById("tableP72");
let tableP7 = document.getElementById("tableP7");
function Func7(file) {
    try {
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(e) {

            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function(sheetName) {
                roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                let cargar = document.getElementById("cargar");
                cargar.style.visibility = "hidden";
                let inputFrancos = document.getElementById("inputFrancos");
                inputFrancos.style.visibility = "hidden";
                let showPresentismo = document.getElementById("showPresentismo");
                showPresentismo.style.visibility = "visible";
                let showFrancos = document.getElementById("showFrancos");
                showFrancos.style.visibility = "visible";
                let faltantes = document.getElementById("faltantes");
                let sobrantes = document.getElementById("sobrantes");
                sobrantes.style.visibility = "visible";
                faltantes.style.visibility = "visible";

                let roa1 = [];
                
                for (const elem of roa){
                    const {chofer, coche, __EMPTY, __EMPTY_1, ...rest} = elem;
                    
                    let x = choferesPorLegajo.filter((n)=> n.legajo == elem.legajo);
                    //console.log(elem,x);
                    if (x.length>0){
                        roa1.push({...rest, chofer: x[0].chofer});
                    } 
                }
                
                for (i=0; i<choferesPorLegajo.length;i++){
                    if (roa1.filter((n)=> n.legajo == choferesPorLegajo[i].legajo)== false){
                        roa1.push(choferesPorLegajo[i]);
                    }
                }
                
                roa1 = roa1.sort((a, b) => (a.legajo > b.legajo) ? 1 : -1);

                let cantFer = prompt("Indique cantidad de días feriados");

                console.log(cantFer);
                
                let fer = [];
                for (i=0;i<cantFer; i++){
                    fer[i] = (prompt("Indique número de día feriado")); 
                }
                
                console.log(fer);

                let sobra = [];
                let falta = [];


                roa1.forEach(function(elem) {
                    for (i=0;i<fer.length;i++){

                        if (elem[fer[i]] == "F" || elem[fer[i]] == "F" || elem[fer[i]] == "v"|| elem[fer[i]] == "f"){
                            elem[fer[i]] = "FN";
                        };
                    };
                    Object.entries(elem).forEach(pair => {
                        if((pair[1])==" "||(pair[1])=="V"||(pair[1])=="V "||(pair[1])=="v"||(pair[1])=="*"||(pair[1])=="e"||(pair[1])==" V"||(pair[1])=="VF"||(pair[1])==" *"||(pair[1])=="V*"||(pair[1])=="  "){
                            let x = pair[0];
                            delete elem[x];
                        };
                        if((pair[1])=="F*"||(pair[1])=="f*"||(pair[1])=="F "||(pair[1])==" F*"||(pair[1])=="f"||(pair[1])==" F"||(pair[1])=="FV*"||(pair[1])=="F *"||(pair[1])=="FV"){
                        let x = pair[0];
                        elem[x] ="F";
                        };
                    });
                    let x = 0;
                    Object.entries(elem).forEach(pair => {
                        if (pair[1]=="F"){
                            x++;
                        }
                        
                    });
                    if (x<6 && x>0){
                        falta.push(elem.legajo);
                    }
                    if (x>6){
                        sobra.push(elem.legajo);
                    }
                    });

                    

                    faltantes.addEventListener('click', () => {
                        const swal1 = swal({
                            icon: "warning",
                            title: "CHOFERES CON FRANCOS FALTANTES",
                            text: `${falta}`,
                        });
                    });
                    sobrantes.addEventListener('click', () => {
                         const swal2 = swal({
                        icon: "warning",
                        title: "CHOFERES CON FRANCOS SOBRANTES",
                        text: `${sobra}`,
                    });
                    });


                    let roaFinal = [];
                    
                    
                    for (const elem of roa1){
                        let x=[];
                        Object.entries(elem).forEach(pair => {
                            if (pair[0]!="legajo" && pair[0]!="chofer"){
                                x.push(pair[0]);
                            }
                            if (pair[1]!="F" && pair[1]!="FN"){
                                x.push(pair[1]);
                            }
                        })
                        
                        let f = x.pop();
                        let ff = x.pop();
                        x.unshift(f);
                        x.unshift(ff);
                        roaFinal.push(x);
                        
                    };
                    
                for (const el of roaFinal){
                    if (el.length<11){
                        do {
                            el.push("");
                        } while(el.length<11);
                    }
                   
                }
                console.log(roaFinal);

                let presentism = [];
                for (const elem of roa1){
                    let x = {
                        ...elem
                    }
                    for (i=1;i<32;i++){
                        let xx = i.toString();
                        if (x[xx]!="F" && x[xx]!="FN"){
                            x[xx] = "";
                        }
                    }
                    presentism.push(x);
                }
                let roaFinal2 = [];
                    for (const elem of presentism){
                        let x  =[];
                        Object.entries(elem).forEach(pair=>{
                            x.push([pair[1]]);
                        })
                        let f = x.pop();
                                let ff = x.pop();
                                x.unshift(f);
                                x.unshift(ff);
                                roaFinal2.push(x);
                    }



                function funcFr() {
                    //Limpiar(infoP7, tablep7);

                    let borrarFr = document.getElementsByClassName("infoP7");
                    let borrarPr = document.getElementsByClassName("infoP72");

                    Limpiar(borrarFr, tableP7);
                    Limpiar(borrarPr, tableP72); 

                    tableP72.style.visibility = "hidden";
                    tableP7.style.visibility = "visible";

                    let titleList = ["LEGAJO", "CHOFER", "1", "2", "3", "4", "5", "6","7", "8", "9"];

                    TitleList("infoP7", titleList, tableP[0]);

                    for (const elem of roaFinal){
                        const node = document.createElement("tr");
                        node.classList.add("infoP7");
                        WriteTable(elem, tableP[0], node);
                    }
                }
                function funcPr() {

                    let borrarFr = document.getElementsByClassName("infoP7");
                    let borrarPr = document.getElementsByClassName("infoP72");
                    
                    Limpiar(borrarFr, tableP7);
                    Limpiar(borrarPr, tableP72);

                    tableP7.style.visibility = "hidden";
                    tableP72.style.visibility = "visible";

                    let titleList2 = ["LEGAJO", "CHOFER", "1", "2", "3", "4", "5", "6","7", "8", "9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

                    TitleList("infoP72", titleList2, tableP72);

                    for (const elem of roaFinal2){
                        const node = document.createElement("tr");
                        node.classList.add("infoP72");
                        WriteTable(elem, tableP72, node);
                    }
                }
                let presentismo = document.getElementById("showPresentismo");

                    presentismo.addEventListener('click', () => {
                        funcPr()
                    });
                let francos = document.getElementById("showFrancos");

                    francos.addEventListener('click', () => {
                        funcFr()
                    });

                });
            }
    } catch (e) {
        console.error(e);
    }
}
