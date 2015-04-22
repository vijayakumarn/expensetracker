function populateDefaultExpenseType() {
	var defaultExpenses = JSON.parse(getDefaultExpenseType());
	var select = document.getElementById("expensetype");
	for(index in defaultExpenses) {
		select.options[select.options.length] = new Option(defaultExpenses[index], index);
	}

	document.getElementById("basic-addon1").textContent = getPreference("currency");
	drawChart();
}

/* populate the select option with default data from localStorage */
function getDefaultExpenseType(){
	//key = DEFAULT_EXPENSE_TYPE
	localStorage = Window.localStorage;	
	if(!localStorage.getItem('DEFAULT_EXPENSE_TYPE')){
		var defaultExpenseType = {
			ENT : 'Entertainment',
			GRO : 'Groceries',
			TRA : 'Travel'
		};
		var defaultExpenses = JSON.stringify(defaultExpenseType);
		localStorage.setItem('DEFAULT_EXPENSE_TYPE', defaultExpenses);
		return defaultExpenses;
	}
	else{
		return localStorage.getItem('DEFAULT_EXPENSE_TYPE');
	}
}

function addExpenseCategory(category)
{
	var defaultExpenses = JSON.parse(getDefaultExpenseType());
	defaultExpenses[category] = category.toUpperCase();
	localStorage.setItem('DEFAULT_EXPENSE_TYPE', JSON.stringify(defaultExpenses));	
}


/* store expense using expense object */
function recordExpense2(expensetype, amount, date)
{
	localStorage = Window.localStorage;
	var masterExpense = []; //array of expense objects
	var expense = {"type":expensetype, "amount":amount, "date":date};
	if(!localStorage.getItem('MASTER_EXPENSE'))
	{		
		masterExpense.push(expense);
		localStorage.setItem('MASTER_EXPENSE', JSON.stringify(masterExpense));		
	}
	else
	{
		masterExpense = JSON.parse(localStorage.getItem('MASTER_EXPENSE'));
		masterExpense.push(expense);
		localStorage.setItem('MASTER_EXPENSE', JSON.stringify(masterExpense));
	}
}

/* Draw Pie chart */
function drawPieChart(){
	var canvas = document.getElementById("piecanvas");
	var ctx = canvas.getContext("2d");

	var data = [];
	var total = 0;
	var dataObj = JSON.parse(localStorage.getItem('ALL_EXPENSE'));
	var keys = Object.keys(dataObj);
	for(var i = 0; i<keys.length; i++){		
		total += dataObj[keys[i]];
		data.push(dataObj[keys[i]]);
	}


	//var data = [10,20,30,40,50,60];
	//var colors = ["#7E3817", "#C35817", "#EE9A4D", "#A0C544", "#348017", "#307D7E"];
	var colors = ["#E43817", "#D35817", "#EE9A4D"];
	
	var center = [canvas.width/2, canvas.height/2];
	var radius = Math.min(canvas.width, canvas.height)/2;
	var lastPos = 0;

	for(var i = 0;i<data.length;i++){
		ctx.fillStyle = colors[i];
		ctx.beginPath();
		ctx.moveTo(center[0], center[1]);
		ctx.arc(center[0], center[1], radius, lastPos, lastPos+(Math.PI*2*(data[i]/total)),false);
		ctx.lineTo(center[0], center[1]);
		ctx.fill();
		lastPos +=Math.PI*2*(data[i]/total);
	}
}

var labels = [];
var data = [];
/* Draw Pie chart */
function drawPieChart2(){
	var canvas = document.getElementById("canvasElement");
	var ctx = canvas.getContext("2d");
	ctx.clear(true);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	var margin = 20;

	//segregated data
	var segData = {};
	//var data = [];
	var total = 0;
	var dataObj = JSON.parse(localStorage.getItem('MASTER_EXPENSE'));
	for(var i = 0;i < dataObj.length; ++i)
	{
		var obj = dataObj[i];
		if(!segData[obj.type])
		{
			segData[obj.type] = parseInt(obj.amount) ;
		}
		else
		{
			segData[obj.type] = parseInt(segData[obj.type]) + parseInt(obj.amount);
		}
	}
	var keys = Object.keys(segData);
	labels = keys;
	for(var i = 0; i < keys.length; i++)
	{		
		total += segData[keys[i]];
		data.push(segData[keys[i]]);
	}


	//var data = [10,20,30,40,50,60];
	//var colors = ["#7E3817", "#C35817", "#EE9A4D", "#A0C544", "#348017", "#307D7E"];
	var colors = ["orange", "yellow", "green", "blue", "black", "magenta"];
	
	var center = [canvas.width/2, canvas.height/2 - 50];
	var radius = Math.min(canvas.width, canvas.height)/2 - 2*margin;
	var lastPos = 0;
	var gap = 0;
	for(var i = 0;i<data.length;i++){
		ctx.fillStyle = colors[i];
		ctx.beginPath();
		ctx.moveTo(center[0], center[1]);

		ctx.arc(center[0], center[1], radius, lastPos, lastPos+(Math.PI*2*(data[i]/total)),false);
		ctx.lineTo(center[0], center[1]);
		ctx.fill();		
		
		
		lastPos +=Math.PI*2*(data[i]/total);
		ctx.fillStyle=colors[i];
		ctx.font = '15pt bold Verdana';
		var text = labels[i] + "-" + Math.round((data[i]/total)*100) + "%";
		var metrics = ctx.measureText(text);
		ctx.fillText(text, gap, canvas.height - 100);
		gap += metrics.width + 10;
	}	
}

function savePreference(currencyInput)
{
	var userpref = {};
	localStorage = Window.localStorage;
	if(!localStorage.getItem('USER_PREF'))
	{
		userpref["currency"] = currencyInput;
		localStorage.setItem('USER_PREF', JSON.stringify(userpref));
	}
	else
	{
		userpref = JSON.parse(localStorage.getItem('USER_PREF'));
		userpref["currency"] = currencyInput;
		localStorage.setItem('USER_PREF', JSON.stringify(userpref));
	}
}

function getPreference(key)
{
	var userpref = {};
	localStorage = Window.localStorage;
	if(localStorage.getItem('USER_PREF'))
	{
		userpref = JSON.parse(localStorage.getItem('USER_PREF'));
		return userpref[key];
	}
	else
	{
		return "INR";
	}
}


/*Draw Bar chart **********/

function drawBarChart() {
	var can, ctx,minVal, maxVal,xScalar, yScalar,numSamples, y;
        // data sets -- set literally or obtain from an ajax call
	
	
	var segData = {};
	var dataValue = [];
	var total = 0;
	
	var dataName = JSON.parse(localStorage.getItem('MASTER_EXPENSE'));
	for(var i = 0;i < dataName.length; ++i)
	{
		var obj = dataName[i];
		if(!segData[obj.type])
		{
			segData[obj.type] = parseInt(obj.amount);
		}
		else
		{
			segData[obj.type] = parseInt(segData[obj.type]) + parseInt(obj.amount);
		}
	}
	var keys = Object.keys(segData);
	for(var i = 0; i < keys.length; i++)
	{		
		total += segData[keys[i]];
		dataValue.push(segData[keys[i]]);
	}
	
	numSamples = dataName.length;
	//maxVal = 10000;
	maxVal = getMaxOfArray(dataValue);
	//var stepSize = 500;
	var stepSize = Math.round(maxVal/dataValue.length);
	var colHead = 50;
	var rowHead = 60;
	var margin = 10;
	var header = "Expense"
	
	can = document.getElementById("canvasElement");
	ctx = can.getContext("2d");
	ctx.fillStyle = "black"
	yScalar = (can.height - colHead - margin) / (maxVal);
	xScalar = (can.width - rowHead) / (numSamples);
	ctx.strokeStyle = "rgba(128,128,255, 0.5)"; // light blue line
	ctx.beginPath();
	// print  column header
	ctx.font = "14pt Helvetica"
	ctx.fillText(header, 0, colHead - margin);
	// print row header and draw horizontal grid lines
	ctx.font = "12pt Helvetica"
	var count =  0;
	for (scale = maxVal; scale >= 0; scale -= stepSize) {
		y = colHead + (yScalar * count * stepSize);
		ctx.fillText(scale, margin,y + margin);
		ctx.moveTo(rowHead, y)
		ctx.lineTo(can.width, y)
		count++;
	}
	ctx.stroke();
	// label samples
	ctx.font = "14pt Helvetica";
	ctx.textBaseline = "bottom";
	for (i = 0; i < dataName.length; i++) {
		y = calcY(can,dataValue[i],yScalar);
		var keys = Object.keys(segData);
		ctx.fillText(keys[i], xScalar * (i + 1), y - margin);
		//ctx.fillText(dataName[i], xScalar * (i + 1), 500);
	}
	// set a color and a shadow
	ctx.fillStyle = "green";
	ctx.translate(0, can.height - margin);
	ctx.scale(xScalar, -1 * yScalar);
	// draw bars
	for (i = 0; i < 3; i++) {
		ctx.fillRect(i + 1, 0, 0.5, dataValue[i]);
	}
}

function calcY(can,value,yScalar) {
    y = can.height - value * yScalar;
    return y;
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}
// Poly fill
CanvasRenderingContext2D.prototype.clear = 
  CanvasRenderingContext2D.prototype.clear || function (preserveTransform) {
    if (preserveTransform) {
      this.save();
      this.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (preserveTransform) {
      this.restore();
    }           
};

function drawChart() {

	var can = document.getElementById("canvasElement");
	var ctx = can.getContext("2d");
	var chartType = document.getElementById("chartType").value;
	//ctx.setTransform(1, 0, 0, 1, 0, 0);
	//ctx.clearRect(0, 0, can.width, can.height);
	// Restore the transform
	//ctx.restore();
	ctx.clear(true);
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	 if(chartType == "pie") {
		drawPieChart2();
		
	 } else if(chartType == "bar") {
		drawBarChart();

	 }
}