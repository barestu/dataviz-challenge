let margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    radius = width / 2

let color = d3.scaleOrdinal()
  .range([
    '#90C695',
    '#EC644B',
    '#81CFE0',
    '#90C695',
    '#E4F1FE',
    '#674172',
    '#F7CA18',
    '#F5D76E',
    '#F5D76E',
    '#EC644B',
    '#EC644B',
    '#F5D76E',
    '#674172',
    '#90C695',
    '#EC644B'
  ])

let arc = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(0)

let label = d3.arc()
  .outerRadius(radius - 50)
  .innerRadius(radius - 50)

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
  console.log(data)
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

  g.append('text')
    .attr('transform', function (d) {
      return `translate(${label.centroid(d)})`
    })
    .attr('dy', '.35em')
    .text(function (d) {
      return d.data.name
    })
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
