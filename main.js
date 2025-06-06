// // Load Final_HR.csv and draw a multi-line chart
// d3.csv("Data/Final_HR.csv").then(raw => {
//     const students = raw.columns.slice(1); // ["S1_HR", ..., "S10_HR"]
//     const data = [];

//     raw.forEach(row => {
//     const t = +row.relative_time;
//     students.forEach(s => {
//         data.push({ time: t, student: s, hr: +row[s] });
//     });
//     });

//     const margin = { top: 20, right: 100, bottom: 40, left: 50 },
//         width = 700 - margin.left - margin.right,
//         height = 400 - margin.top - margin.bottom;

//     const svg = d3.select("#section-1 .content-wrapper")
//     .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

//     const x = d3.scaleLinear()
//     .domain(d3.extent(data, d => d.time))
//     .range([0, width]);

//     const y = d3.scaleLinear()
//     .domain([60, d3.max(data, d => d.hr)]).nice()
//     .range([height, 0]);

//     const color = d3.scaleOrdinal()
//     .domain(students)
//     .range(d3.schemeTableau10);

//     svg.append("g")
//     .attr("transform", `translate(0,${height})`)
//     .call(d3.axisBottom(x).ticks(10).tickFormat(d => `${d}s`));

//     svg.append("g")
//     .call(d3.axisLeft(y).ticks(5));

//     const line = d3.line()
//     .x(d => x(d.time))
//     .y(d => y(d.hr));

//     const studentGroups = d3.group(data, d => d.student);
//     studentGroups.forEach((values, key) => {
//     svg.append("path")
//         .datum(values)
//         .attr("fill", "none")
//         .attr("stroke", color(key))
//         .attr("stroke-width", 1.5)
//         .attr("d", line);
//     });

//     svg.append("text")
//     .attr("x", width / 2).attr("y", height + margin.bottom - 5)
//     .attr("text-anchor", "middle")
//     .attr("fill", "white")
//     .text("Time (seconds)");

//     svg.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("x", -height / 2).attr("y", -40)
//     .attr("text-anchor", "middle")
//     .attr("fill", "white")
//     .text("Heart Rate (BPM)");
// });