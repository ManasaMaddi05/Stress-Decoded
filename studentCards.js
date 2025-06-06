// studentCards.js
document.addEventListener('DOMContentLoaded', function() {
  console.log("Student cards script loaded");
  
  // Check if the target element exists
  const cardsContainer = document.getElementById('cards-container');
  if (!cardsContainer) {
    console.error("Could not find #cards-container element");
    return;
  }
  
  console.log("Found cards container, initializing student cards");
  
  // Sample data for students
  const studentsData = [
    {
      id: 'S1',
      name: 'Alex Johnson',
      data: generateSampleData(60, 2, 5),
      peakTime: 15,
      recoveryTime: 8.2,
      avgEDA: 3.7,
      maxEDA: 6.2
    },
    {
      id: 'S2',
      name: 'Jamie Smith',
      data: generateSampleData(60, 1.5, 7),
      peakTime: 22,
      recoveryTime: 12.5,
      avgEDA: 4.2,
      maxEDA: 7.8
    },
    {
      id: 'S3',
      name: 'Taylor Wong',
      data: generateSampleData(60, 3, 4),
      peakTime: 8,
      recoveryTime: 5.4,
      avgEDA: 3.1,
      maxEDA: 5.5
    }
  ];
  
  const overlay = document.getElementById('overlay');
  
  // Generate cards for each student
  studentsData.forEach(student => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-header">
        <div>
          <h3 class="student-name">${student.name}</h3>
          <div class="student-id">${student.id}</div>
        </div>
      </div>
      <div class="sparkline-container" id="sparkline-${student.id}"></div>
      <div class="detailed-chart-container" id="detailed-chart-${student.id}"></div>
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-value">${student.maxEDA.toFixed(1)}</div>
          <div class="stat-label">Max EDA (μS)</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${student.avgEDA.toFixed(1)}</div>
          <div class="stat-label">Avg EDA (μS)</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${student.peakTime}</div>
          <div class="stat-label">Peak Time (min)</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${student.recoveryTime}</div>
          <div class="stat-label">Recovery Time (min)</div>
        </div>
      </div>
      <button class="back-button">Close</button>
    `;
    
    cardsContainer.appendChild(card);
    
    // Create sparkline
    createSparkline(student.data, `sparkline-${student.id}`);
    
    // Add click event to expand card
    card.addEventListener('click', function(e) {
      if (!this.classList.contains('expanded') && e.target !== this.querySelector('.back-button')) {
        this.classList.add('expanded');
        overlay.classList.add('active');
        createDetailedChart(student, `detailed-chart-${student.id}`);
      }
    });
    
    // Add click event to back button
    const backButton = card.querySelector('.back-button');
    backButton.addEventListener('click', function(e) {
      e.stopPropagation();
      card.classList.remove('expanded');
      overlay.classList.remove('active');
    });
  });
  
  // Close expanded card when clicking overlay
  overlay.addEventListener('click', function() {
    const expandedCard = document.querySelector('.card.expanded');
    if (expandedCard) {
      expandedCard.classList.remove('expanded');
      overlay.classList.remove('active');
    }
  });
  
  // Function to create sparkline
  function createSparkline(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 5, right: 5, bottom: 5, left: 5 };
    
    const svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right]);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data) * 1.1])
      .range([height - margin.bottom, margin.top]);
    
    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'var(--stress-color, #a855f7)')
      .attr('stroke-width', 2)
      .attr('d', line);
  }
  
  // Function to create detailed chart
  function createDetailedChart(student, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = ''; // Clear previous chart
    
    const width = container.clientWidth;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    
    const svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
    
    const x = d3.scaleLinear()
      .domain([0, student.data.length - 1])
      .range([margin.left, width - margin.right]);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(student.data) * 1.1])
      .range([height - margin.bottom, margin.top]);
    
    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(10).tickFormat(d => `${d}m`))
      .call(g => g.select('.domain').attr('stroke', 'rgba(255, 255, 255, 0.3)'))
      .call(g => g.selectAll('.tick line').attr('stroke', 'rgba(255, 255, 255, 0.3)'))
      .call(g => g.selectAll('.tick text').attr('fill', 'rgba(255, 255, 255, 0.7)'));
    
    // Add Y axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5))
      .call(g => g.select('.domain').attr('stroke', 'rgba(255, 255, 255, 0.3)'))
      .call(g => g.selectAll('.tick line').attr('stroke', 'rgba(255, 255, 255, 0.3)'))
      .call(g => g.selectAll('.tick text').attr('fill', 'rgba(255, 255, 255, 0.7)'));
    
    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', margin.left / 3)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text('EDA (μS)');
    
    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text('Time (minutes)');
    
    // Add the line
    const line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(student.data)
      .attr('fill', 'none')
      .attr('stroke', 'var(--stress-color, #a855f7)')
      .attr('stroke-width', 2.5)
      .attr('d', line);
    
    // Add area under the curve
    const area = d3.area()
      .x((d, i) => x(i))
      .y0(height - margin.bottom)
      .y1(d => y(d))
      .curve(d3.curveMonotoneX);
    
    svg.append('path')
      .datum(student.data)
      .attr('fill', 'url(#gradient)')
      .attr('opacity', 0.3)
      .attr('d', area);
    
    // Add gradient
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'var(--stress-color, #a855f7)')
      .attr('stop-opacity', 1);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'var(--stress-color, #a855f7)')
      .attr('stop-opacity', 0);
    
    // Find peak index
    const peakIndex = student.data.indexOf(d3.max(student.data));
    
    // Add peak annotation
    svg.append('circle')
      .attr('cx', x(peakIndex))
      .attr('cy', y(student.data[peakIndex]))
      .attr('r', 5)
      .attr('fill', '#ff4560')
      .attr('stroke', 'white')
      .attr('stroke-width', 1);
    
    svg.append('line')
      .attr('class', 'annotation-line')
      .attr('x1', x(peakIndex))
      .attr('y1', y(student.data[peakIndex]) + 10)
      .attr('x2', x(peakIndex))
      .attr('y2', y(student.data[peakIndex]) + 40);
    
    svg.append('text')
      .attr('class', 'annotation')
      .attr('x', x(peakIndex))
      .attr('y', y(student.data[peakIndex]) + 55)
      .attr('text-anchor', 'middle')
      .text(`Peak: ${student.data[peakIndex].toFixed(1)} μS`);
    
    // Add recovery annotation
    const recoveryIndex = Math.min(peakIndex + Math.floor(student.recoveryTime), student.data.length - 1);
    
    svg.append('circle')
      .attr('cx', x(recoveryIndex))
      .attr('cy', y(student.data[recoveryIndex]))
      .attr('r', 5)
      .attr('fill', 'var(--calm-color, #0ea5e9)')
      .attr('stroke', 'white')
      .attr('stroke-width', 1);
    
    svg.append('line')
      .attr('class', 'annotation-line')
      .attr('x1', x(recoveryIndex))
      .attr('y1', y(student.data[recoveryIndex]) - 10)
      .attr('x2', x(recoveryIndex))
      .attr('y2', y(student.data[recoveryIndex]) - 40);
    
    svg.append('text')
      .attr('class', 'annotation')
      .attr('x', x(recoveryIndex))
      .attr('y', y(student.data[recoveryIndex]) - 55)
      .attr('text-anchor', 'middle')
      .text(`Recovery: ${student.data[recoveryIndex].toFixed(1)} μS`);
      
    // Add end-state annotation
    const endIndex = student.data.length - 1;
    
    svg.append('circle')
      .attr('cx', x(endIndex))
      .attr('cy', y(student.data[endIndex]))
      .attr('r', 5)
      .attr('fill', '#10b981')
      .attr('stroke', 'white')
      .attr('stroke-width', 1);
    
    svg.append('line')
      .attr('class', 'annotation-line')
      .attr('x1', x(endIndex))
      .attr('y1', y(student.data[endIndex]) + 10)
      .attr('x2', x(endIndex))
      .attr('y2', y(student.data[endIndex]) + 40);
    
    svg.append('text')
      .attr('class', 'annotation')
      .attr('x', x(endIndex))
      .attr('y', y(student.data[endIndex]) + 55)
      .attr('text-anchor', 'middle')
      .text(`End: ${student.data[endIndex].toFixed(1)} μS`);
  }
  
  // Function to generate sample data
  function generateSampleData(length, baseValue, peakMultiplier) {
    const data = [];
    const peakIndex = Math.floor(length * 0.3 + Math.random() * length * 0.4);
    
    for (let i = 0; i < length; i++) {
      let value;
      const distFromPeak = Math.abs(i - peakIndex);
      
      if (i < peakIndex) {
        // Ramp up to peak
        value = baseValue + (peakMultiplier - 1) * baseValue * (1 - distFromPeak / peakIndex);
      } else {
        // Decay from peak
        value = baseValue + (peakMultiplier - 1) * baseValue * Math.exp(-distFromPeak / (length * 0.2));
      }
      
      // Add some noise
      value += (Math.random() - 0.5) * baseValue * 0.4;
      
      data.push(Math.max(0, value));
    }
    
    return data;
  }
});