const state = {
    chartsData: {
        year: {
            cat: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"],
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5]
        },
        month: {
            cat: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            data: [1, 3, 10, 5, 6, 3, 6, 20, 44, 10, 11, 256]
        },
        week: {
            cat: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            data: [5.5, 5.6, 7.2, 8.8, 9.9, 5.3, 5.9]
        },
        day: {
            cat: ["0:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
            data: [1, 5, 8, 13, 42, 77, 34, 63, 40, 45, 234, 56, 23, 11, 34, 55, 10, 55, 78, 70, 99, 14, 23, 11]
        }
    },
    activePeriod: "year",
    periods: [{
        type: "alltime",
        name: "All Time"
    }, {
        type: "year",
        name: "Year"
    }, {
        type: "month",
        name: "Month"
    }, {
        type: "week",
        name: "Week"
    }, {
        type: "day",
        name: "Day"
    }],
    options: {
        plotOptions: {
            line: {
                marker: {
                    enabled: false
                }
            },
            series: {
                color: "#34343e"
            }
        },
        chart: {
            backgroundColor: "#ECECEC",
            type: "line"
        },
        credits: {
            enabled: false
        },
        title: {
            text: ""
        },
        xAxis: {
            // categories: [],
            tickColor: '',
            lineWidth: 1,
            gridLineWidth: 2,
            tickInterval: 1,
            tickLength: 1,
            minorTickLength: 1,
            minorGridLineWidth: 10,
            lineColor: '#dedfdf',

        },
        yAxis: {
            lineWidth: 1,
            gridLineWidth: 2,
            tickInterval: 1,
            tickLength: 1,
            // plotLines: [{
            //     value: 10,
            //     width: 10
            // }],
            title: {
                text: null
            },
            lineColor: '#dedfdf',
        },
        tooltip: {
            valueSuffix: "USD"
        },
        series: [{
            name: "ALE",
            data: [],
            showInLegend: false
        }]
    }
};

const mutations = {
    SET_DEFAULT_CHARTS(state, period) {
        state.options.xAxis.categories = state.chartsData[period].cat;
        state.options.series[0].data = state.chartsData[period].data;
    },
    SET_ACTIVE_PERIOD(state, period) {
        state.activePeriod = period;
    }
};

export default {
    state,
    mutations
}
