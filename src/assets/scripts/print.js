
function printInvoice(){
var prtContent = document.getElementById("printView");
var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
WinPrint.document.write(`<style type="text/css">
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input{
  width: 70px;
  margin-left: 8px;
}

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  text-align: center;
  font-size: 14px;
}
table{
    table-layout: fixed;
    margin: 8px 8px 0 8px;
}

th{
  background-color: #d3d3d3;
}

.one-third{
  width: 33%;
}

.one-third span{
  display: block;
}
</style>`);
let inp = document.getElementById("billNo");
inp.setAttribute("value", inp.value);
WinPrint.document.write(prtContent.innerHTML);
WinPrint.document.close();
WinPrint.focus();
WinPrint.print();
WinPrint.close();
}
