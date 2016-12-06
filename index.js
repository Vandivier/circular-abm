//ref: http://bl.ocks.org/nsonnad/5993342
//todo: maybe canvas
//todo: iLinearVarietyFactor: affect income. Later: agent has heterogenous properties. Later: from d3.randomNormal. Maybe size also like original author?
//todo: D3 v4




//ref: https://bl.ocks.org/mindrones/5a20e38c9654f540497754566d089c4d
/* setup */
var iWidth = window.innerWidth;
var iHeight = window.innerHeight;
var iArrCenter = [iWidth / 2, iHeight / 2];

var margin = 30,
    iWidth = 500 - margin * 2,
    iHeight = iWidth,
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

/* DOM init
var svg =
    d3.select('#chart').append('svg')
    .attr('width', iWidth)
    .attr('height', iHeight);
     */
/*
var g = svg.append('g')
    .attr('transform', 'translate(' + iArrCenter + ')')

var g_path =
    g.append('g').attr('id', 'path')
    .on('click', toggleNetworkVisibility)

var g_links =
    g.append('g').attr('id', 'links')
    .style('display', heart.showNetwork ? null : 'none')

var g_nodes =
    g.append('g').attr('id', 'nodes')
    .style('display', heart.showNetwork ? null : 'none')

var node = g_nodes.selectAll('circle').data(heart.nodes)
node.exit().remove()
node = node.enter().append('circle')
    .attr('r', 5)
    .merge(node)
*/
/*
var svg = d3.select('#chart').append('svg')
    .attr('width', iWidth + margin * 2)
    .attr('height', iHeight + margin * 2)
    .append('g')
    .attr('transform', 'translate(' + margin + ',' + margin + ')');

var pool = svg.append('circle')
    .style('stroke-width', strokeWidth * 2)
    .attr({
        class: 'pool',
        r: radius,
        cy: 0,
        cx: 0,
        transform: 'translate(' + iWidth / 2 + ',' + iHeight / 2 + ')'
    });



var oNodes = randomNodes(20);
console.log(oNodes);
console.log(svg);
console.log(pool);

var simulation = d3.forceSimulation()
    .nodes(oNodes)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(iArrCenter));

    
    
var node = svg.selectAll('.nodes')
    .data(oNodes)
.enter().append('circle')
    .attr({
        class: 'nodes',
        r: function (oNode) { return d.rad + nodeBaseRad },
        fill: "#fff8d1"
    });

    console.log(node);
    
simulation
    .on('tick', ticked);
*/

var svg = d3.select('#chart').append('svg');
var oNodes = randomNodes(20);

var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(iWidth / 2, iHeight / 2));

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("circle")
    .data(oNodes)
    .enter().append("circle")
      .attr("r", 2.5)
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended));

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(oNodes)
      .on("tick", ticked);