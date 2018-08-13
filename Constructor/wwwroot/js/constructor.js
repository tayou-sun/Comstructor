var cell;
var maxrowspan = 0;
var childrens = [];

var currentTr;
var prevCell;

var cells = [];

function TableCell(currentTr, currentCell, childCells, isChild, parentCell) {
    this.currentTr = currentTr;
    this.currentCell = currentCell;
    this.childCells = childCells;
    this.isChild = isChild;
    this.parentCell = parentCell;
}

TableCell.prototype.getRow = function() {
    var trs = $("#constructor").find("tr");
    if (trs.length > 1) {
        var index = trs.index(this.currentTr);
        if (trs[index + 1] != undefined)
            return trs[index + 1];
        else {
            var thead = $("#constructor").find("thead");
            var tr = document.createElement('tr');
            thead[0].appendChild(tr);
            return tr;
        }
    }
    else {
        var thead = $("#constructor").find("thead");
        var tr = document.createElement('tr');
        thead[0].appendChild(tr);
        return tr;
    }
}

TableCell.prototype.SetIsChild = function (isChild) {
    this.isChild = isChild;
}

TableCell.prototype.setParentCell = function (parentCell) {
    this.parentCell = parentCell;
}

function getAllChild() {
    var child = [];

    for (var i = 0; i < cells.length; i++) {
        if (cells[i].childCells.length == 0)
            child.push(cells[i].currentCell);
    }

    return child;
}

$(document).ready(function () {

    $("#referenceHeader").click(function () {
        modalWindow1.show(300);
    });


    $("#deleteHeader").click(function () {
        $(".header.clicked").remove();
    });

    //Cоздание ячейки того же уровня
    $("#createHeader").click(function () {
        if (cell != null) {
            var th = createTh($(cell).parent()[0], null, false, null);
            $(th).attr("rowspan", maxrowspan);
        }
        else {
            var thead = $("#constructor").find("thead");
            var tr = document.createElement('tr');
            thead[0].appendChild(tr);
            createTh(tr, null, false, null);
        }
    });

    $("#createSubHeader").click(function () {

        var currentTableCell;
        var ths = [];


        for (var i = 0; i < cells.length; i++) {
            if (cells[i].currentCell == cell) {
                currentTableCell = cells[i];
            }
            if (!cells[i].isChild) {
                ths.push(cells[i]);
            }
        }

        if (currentTableCell.parentCell != undefined && currentTableCell.parentCell.childCells.length != 0) {
            currentTableCell.parentCell.childCells.forEach(function (element) {
         
                ths.push(element);             
            });
        }
        //maxrowspan = 
        var tr;
        var colspan = $(cell).attr("colspan");

            if (currentTableCell.childCells.length > 0)
                tr = currentTableCell.childCells[0].currentTr;
            else {
                tr = currentTableCell.getRow();
            
        }


        for (var i = 0; i < ths.length; i++) {
            if (ths[i].currentCell != cell) {
                //if ($(ths[i]).attr('colspan') != undefined){
                maxrowspan = $("#constructor").find("tr").length;
                if (ths[i].childCells.length == 0)
                    $(ths[i].currentCell).attr('rowspan', 0);

                //var colSpanValue = $(ths[i].currentCell).attr('colspan');
                //colSpanValue = colSpanValue == undefined ? 0 : parseInt(colSpanValue);
                //$(ths[i].currentCell).attr('colspan', colSpanValue - 1);
                //}
            }
            else {
                var colSpanValue = $(ths[i].currentCell).attr('colspan');
                colSpanValue = colSpanValue == undefined ? 0 : parseInt(colSpanValue);
                $(ths[i].currentCell).attr('colspan', colSpanValue + 1);
                var parent = currentTableCell.parentCell; 
                while (parent != null) {
                    var colSpanValue = $(parent.currentCell).attr('colspan');
                    colSpanValue = colSpanValue == undefined ? 0 : parseInt(colSpanValue);
                    $(parent.currentCell).attr('colspan', colSpanValue + 1);
                    parent = parent.parentCell;
                }
            }
        }
        createTh(tr, currentTableCell, true);
    });

    $(".header").click(function () {
        headerClick() 
    });

    //Создание ячейки
    function createTh(tr, currentTableCell, isChild) {
        var th = document.createElement('th');
        th.innerHTML = $("#name").val();
        th.classList.add('header');
        th.addEventListener('click', headerClick);
        //tr.appendChild(th);
       
        isChild ? insertAfter(th, tr) : tr.appendChild(th);
        var tableCell = new TableCell(tr, th, [], isChild, currentTableCell);

        if (currentTableCell != null) {
            currentTableCell.childCells.push(tableCell);
            $(currentTableCell.currentCell).attr("rowspan", "");
        }
        cells.push(tableCell);
        return th;
    }

    function headerClick() {
        var ths = $("#constructor").find("th");

        for (var i = 0; i < ths.length; i++) {
            ths[i].classList.remove('clicked');
        }

        event.target.classList.add('clicked');
        prevCell = cell;
        cell = event.target;
    }
    
    function insertAfter(elem, refElem) {
        return refElem.insertBefore(elem, refElem.nextSibling);
    }

    var modalWindow1 = {
        _block: null,
        _win: null,
        initWin: function (width) {
            _win1 = document.getElementById('modalwindow');

            var parent = document.getElementsByTagName('body')[0];
            var obj = parent.firstChild;
            _win1 = document.createElement('div');
            _win1.id = 'modalwindow';
            _win1.style.padding = '0 0 5px 0';


            var content = document.createElement("div");
            content.classList.add('contentField');

            var child = getAllChild();

            for (var i = 0; i < child.length; i++) {
                var form = document.createElement("div");
                form.classList.add("inputForm");

                var elem = document.createElement("p");
                elem.innerHTML = $(child[i]).text();
                form.appendChild(elem);

                var input = document.createElement("input");
                input.classList.add("text_textSumm");
                form.appendChild(input);

                content.appendChild(form);
            }
            parent.insertBefore(_win1, obj);;

            _win1.style.width = width + 'px'; //Установим ширину окна
            _win1.style.display = 'inline'; //Зададим CSS-свойство

            _win1.style.left = '60%'; //Позиция по горизонтали
            _win1.style.top = '40%'; //Позиция по вертикали

            _win1.style.marginTop = -(_win1.offsetHeight / 2) + 'px';
            _win1.style.marginLeft = -(600 / 2) + 'px';

            var cancelButton = document.createElement("a");
            cancelButton.appendChild(document.createTextNode("Отмена"));
            cancelButton.id = 'cancelButton';
            cancelButton.classList.add("btn");
            cancelButton.classList.add("btn-link");

            var footer = document.createElement("div");
            footer.classList.add('footerFieldSumm');
            footer.paddingLeft = "30%";
            footer.appendChild(cancelButton);


            $(document).on("click", "#cancelButton", function () {
                document.getElementById('modalwindow').style.display = 'none';
            });

            _win1.appendChild(content);
            _win1.appendChild(footer);
        },
        close: function () {
            document.getElementById('blockscreen').style.display = 'none';
            document.getElementById('modalwindow').style.display = 'none';
        },
        show: function (width, e) {
            modalWindow1.initWin(width, e);
        }
    };
});

