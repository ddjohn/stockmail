'use strict';

const dateFns = require('date-fns')
const yahoo = require ('yahoo-finance');

const now = new Date();
now.setDate(now.getDate() + 1);
const to = dateFns.format(now, "yyyy-MM-dd")
now.setDate(now.getDate() - 31);
const from = dateFns.format(now, "yyyy-MM-dd")

function averageFkn(quotes) {
    var no = 0;
    var price = 0;
    let volume = 0
    quotes.forEach(quote => {
        no++;
        price += quote.close
        volume += quote.volume
    })
    return {price: price / no, volume: volume / no}
}

function maxminFkn(quotes) {
    let max = 0.0;
    let min = 100000.0;
    
    quotes.forEach(quote => {
        let price = parseFloat(quote.close)

        max = price > max ? price : max
        min = price < min ? price : min
    })
    return {max: max, min: min}
}

function bollinger(quotes, average) {
    let sum = 0.0;
    let n = 0;
    
    quotes.forEach(quote => {
        let price = parseFloat(quote.close)

        n++;
        sum += Math.pow(price-average, 2)        
    })
    return Math.sqrt(sum/n)
}

function rsi(quotes) {
    let up = 0;
    let down = 0;
    
    let old = NaN;
    quotes.forEach(quote => {
        let price = parseFloat(quote.close)

        if(price < old) {
            up++;
        }

        if(price > old) {
            down++;
        }

        old = price;
    })
    return 100-100/(1+up/down)
}

function web_column(value) {
    console.log("<td>" + value + "</td>")
}

function web_column_dochian(value) {
    if(value > 95) {
        console.log("<td class='green'>" + parseFloat(value).toFixed(2) + "</td>")
        return
    }

    if(value < 5) {
        console.log("<td class='red'>" + parseFloat(value).toFixed(2) + "</td>")
        return
    }

    console.log("<td>" + parseFloat(value).toFixed(2) + "</td>")
}

function web_column_rsi(value) {
    if(value > 70) {
        console.log("<td class='red'>" + parseFloat(value).toFixed(2) + "</td>")
        return
    }

    if(value < 30) {
        console.log("<td class='green'>" + parseFloat(value).toFixed(2) + "</td>")
        return
    }

    console.log("<td>" + parseFloat(value).toFixed(2) + "</td>")
}

function web_column_stochastic(value) {
    if(value > 80) {
        console.log("<td class='red'>" + parseFloat(value).toFixed(2) + "</td>")
        return
    }

    if(value < 20) {
        console.log("<td class='green'>" + parseFloat(value).toFixed(2) + "</td>")
        return
    }

    console.log("<td>" + parseFloat(value).toFixed(2) + "</td>")
}

function web_column_volume(value) {
    if(value > 10) {
        console.log("<td class='green'>" + parseFloat(value).toFixed(2) + "</td>")
        return
    }

    console.log("<td>" + parseFloat(value).toFixed(2) + "</td>")
}

function web_column_bollinger(value) {
    if(value < 5) {
        console.log("<td class='green'>" + parseFloat(value).toFixed(2) + "</td>")
        return
    }

    console.log("<td>" + parseFloat(value).toFixed(2) + "</td>")
}

function web_column_average(value) {
    if(value > 0) {
        console.log("<td class='green'>" + parseFloat(value).toFixed(2) + "</td>")
        return
    }

    console.log("<td>" + parseFloat(value).toFixed(2) + "</td>")
}

async function hello(stock) {
    await yahoo.historical({
        symbol: stock,
        from: from,
        to: to,
        period: 'd'
    }, function (err, quotes) {
        //console.log(quotes);
        return quotes
    });
}

(async function () {
    //const now = new Date();
    //const to = dateFns.format(now, "yyyy-MM-dd")
    //now.setDate(now.getDate() - 30);
    //const from = dateFns.format(now, "yyyy-MM-dd")

    const stocks = ["%5EOMX", 
	                "ABB.ST", "ALFA.ST", "ALIV-SDB.ST", "ASSA-B.ST", "ATCO-A.ST", 
                    "ATCO-B.ST", "AZN.ST", "BOL.ST", "ELUX-B.ST", "ERIC-B.ST", 
                    "ESSITY-B.ST", "EVO.ST", "GETI-B.ST", "HEXA-B.ST", "HM-B.ST", 
                    "INVE-B.ST", "KINV-B.ST", "NDA-SE.ST", "SAND.ST", "SCA-B.ST", 
                    "SEB-A.ST", "SHB-A.ST", "SINCH.ST", "SKA-B.ST", "SKF-B.ST", 
                    "SWED-A.ST", "SWMA.ST", "TEL2-B.ST", "TELIA.ST", "VOLV-B.ST"];    
    
    console.log("<style>")
    console.log("body {font- Verdana}")
    console.log("th {background-color: red; color: yellow}")
    console.log("td {background-color: lightgray}")
    console.log(".red {background-color: red}")
    console.log(".green {background-color: green}")
    console.log("</style>")

    console.log("<table border='1'>")
    console.log("<tr>")
    console.log("<th>stock</th>")
    console.log("<th>price</th>")
    console.log("<th>VolumeJump</th>")
    console.log("<th>PositiveTrend</th>")
    console.log("<th>Donchian</th>")
    console.log("<th>Squeeeze</th>")
    console.log("<th>crossover</th>")
    console.log("<th>RSI</th>")
    console.log("<th>FastK</th>")
    console.log("</tr>")
    
    stocks.forEach((stock) => {
        hello(stock).then(a => {
            console.log('a', a)
        });

        yahoo.historical({
            symbol: stock,
            from: from,
            to: to,
            period: 'd'
        }, function (err, quotes) {
            console.log('<tr>')
            //console.log('error=' + err)
       	   web_column(stock)

	    if(quotes[0] === undefined) {
		    console.log(stock, quotes);
	    } else {
	        let price = quotes[0].close
       		let yesterday = quotes[1].close
       		let volume = quotes[0].volume
       		let average = averageFkn(quotes);
       		let maxmin = maxminFkn(quotes);
       		let width = bollinger(quotes, average.price);
       		let r = rsi(quotes);
       		let fastK = 100.0*(quotes[0].close - maxmin.min) / (maxmin.max - maxmin.min)
	
       		web_column(price)
       		web_column_volume(100.0*(volume-average.volume)/volume)
       		web_column_average(100.0*(price-average.price)/price)
       		web_column_dochian(100.0*(price-maxmin.min)/(maxmin.max-maxmin.min))
       		web_column_bollinger(width)
       		web_column((price-average)*(yesterday-average)<0 ? (price-yesterday)/average: 0)
       		web_column_rsi(r)
       	    web_column_stochastic(fastK)
	    }
        console.log('</tr>')
    });
/*
        yahoo.quote({
            symbol: stock,
            modules: [ 'price', 'summaryDetail' ]
        }, function (err, quotes) {
                console.log(quotes)
        });
	*/
    });
}) ();
