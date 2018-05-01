let margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    radius = width / 2

let color = d3.scaleOrdinal()
  .range([
    '#90C695', // grass
    '#EC644B', // fire
    '#81CFE0', // water
    '#90C695', // bug
    '#E4F1FE', // normal
    '#674172', // poison
    '#F7CA18', // electric
    '#F5D76E', // ground
    '#F5D76E', // fairy
    '#EC644B', // fighting
    '#EC644B', // psychic
    '#F5D76E', // rock
    '#674172', // ghost
    '#90C695', // ice
    '#EC644B' // dragon
  ])

let arc = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(0)

let label = d3.arc()
  .outerRadius(radius - 20)
  .innerRadius(radius - 20)

let pie = d3.pie()
  .sort(null)
  .value(function (d) {
    return d.total
  })

let svg = d3.select('.chart-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

function fetchPokedex () {
  return new Promise (function(resolve, reject) {
    d3.csv('./Pokemon.csv', function (d) {
      return {
        id: +d.Id,
        name: d.Name,
        type1: d.Type1,
        type2: d.Type2,
        hp: d.HP,
        attack: d.Attack,
        defense: d.Defense,
        spAtk: d.SpAtk,
        spDef: d.SpDef,
        speed: d.Speed,
        generation: d.Generation
      }
    })
    .then(data => {
      data = data.filter(pokemon => pokemon.generation === '1')
      resolve(data)
    })
    .catch(error => {
      reject(error)
    })
  })
}

function createChart(data) {
  let g = svg.selectAll('.arc')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'arc')

  g.append('path')
    .attr('d', arc)
    .style('fill', function (d) {
      return color(d.data.name)
    })
    .transition()
    .ease(d3.easeLinear)
    .duration(1500)
    .attrTween('d', pieTween)

  g.append('text')
    .transition()
    .ease(d3.easeLinear)
    .duration(1500)
    .attrTween('d', pieTween)
    .attr('transform', function (d) {
      return `translate(${label.centroid(d)})`
    })
    .attr('dy', '.35em')
    .text(function (d) {
      return d.data.name
    })
}

function pieTween(b) {
  b.innerRadius = 0
  let i = d3.interpolate({ startAngle: 0, endAngle: 0 }, b)
  return function (t) { return arc(i(t)) }
}

fetchPokedex()
  .then(pokedex => {
    let arrType = []
    let type = pokedex.map(pokemon => pokemon.type1)
    type = type.filter((value, index, self) => {
      return self.indexOf(value) === index
    })

    type.forEach(type => {
      let sum = 0
      pokedex.forEach(pokemon => {
        if (pokemon.type1 === type) {
          sum++
        }
      })

      let objType = {
        name: type,
        total: sum
      }

      arrType.push(objType)
    })

    createChart(arrType)
  })
