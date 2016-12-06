//ref: http://bl.ocks.org/nsonnad/5993342
//ref: http://bl.ocks.org/mbostock/2675ff61ea5e063ede2b5d63c08020c7
//todo: maybe canvas
//todo: iLinearVarietyFactor: affect income. Later: agent has heterogenous properties. Later: from d3.randomNormal. Maybe size also like original author?
//ref: https://bl.ocks.org/mindrones/5a20e38c9654f540497754566d089c4d

/* setup */
var iWidth = window.innerWidth;
var iHeight = window.innerHeight;

var margin = 30,
    radius = iWidth / 2,
    strokeWidth = 4,
    hyp2 = Math.pow(radius, 2),
    nodeBaseRad = 5,
    iLinearVarietyFactor = 3; //currently only affects speed of convergence toward goal / center

function ticked() {
    node.attr('cx', function (d) { return d.x = pythag(d.rad, d.y, d.x); })
        .attr('cy', function (d) { return d.y = pythag(d.rad, d.x, d.y); });
}

function pythag(r, b, coord) {
    //r += nodeBaseRad;
    r = nodeBaseRad;

    // force use of b coord that exists in circle to avoid sqrt(x<0)
    b = Math.min(iWidth - r - strokeWidth, Math.max(r + strokeWidth, b));

    var b2 = Math.pow((b - radius), 2),
        a = Math.sqrt(hyp2 - b2);

    // radius - sqrt(hyp^2 - b^2) < coord < sqrt(hyp^2 - b^2) + radius
    coord = Math.max(radius - a + r + strokeWidth,
                Math.min(a + radius - r - strokeWidth, coord));

    return coord;
}

function randomNodes(n) {
    var data = [],
        range = d3.range(n);

    for (var i = range.length - 1; i >= 0; i--) {
        data.push({
            rad: Math.floor(Math.random() * iLinearVarietyFactor)
        });
    }
    return data;
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

/* DOM init */
var svg = d3.select('#chart').append('svg')
    .attr('width', iWidth - margin)
    .attr('height', iHeight - margin)
    .append('g')
    .attr('transform', 'translate(' + margin + ',' + margin + ')');

//ref: attrs http://stackoverflow.com/questions/20822466/how-to-set-multiple-attributes-with-one-value-function/38209449#38209449

var pool = svg.append('circle')
    .style('stroke-width', strokeWidth * 2)
    .attrs({
        class: 'pool',
        //r: radius,
        r: Math.min(iWidth, iHeight)/2 - 2*margin,
        cy: 0,
        cx: 0,
        transform: 'translate(' + iWidth / 2 + ',' + (iHeight / 2 - margin) + ')'
    });  //todo: numerical calcs may be janky

var oNodes = randomNodes(20);

var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(iWidth / 2, iHeight / 2));

var node = svg.selectAll('.nodes')
    .data(oNodes)
.enter().append('circle')
    .attrs({
        class: 'nodes',
        r: function (oNode) { return oNode.rad + nodeBaseRad },
        fill: "#fff8d1"
    })
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  simulation
      .nodes(oNodes)
      .on("tick", ticked);
