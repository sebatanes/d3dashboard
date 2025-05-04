<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import { useThemeStore } from '../../stores/theme'

interface ChartData {
  x: string
  y: number
}

const props = withDefaults(defineProps<{
  data: ChartData[]
  title: string
  xAxisLabel?: string
  yAxisLabel?: string
  animate?: boolean
  height?: number
}>(), {
  animate: false,
  height: 300
})

const chartRef = ref<HTMLDivElement | null>(null)
const themeStore = useThemeStore()

const renderChart = async () => {
  if (!chartRef.value || props.data.length === 0) return

  d3.select(chartRef.value).selectAll('*').remove()

  const margin = { top: 30, right: 30, bottom: 50, left: 60 }
  const width = chartRef.value.clientWidth - margin.left - margin.right
  const height = props.height - margin.top - margin.bottom

  const svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const x = d3.scaleBand()
    .domain(props.data.map(d => d.x))
    .range([0, width])
    .padding(0.1)

  const y = d3.scaleLinear()
    .domain([0, d3.max(props.data, d => d.y) as number * 1.1])
    .range([height, 0])

  const line = d3.line<ChartData>()
    .x(d => (x(d.x) as number) + x.bandwidth() / 2)
    .y(d => y(d.y))
    .curve(d3.curveMonotoneX)

  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSize(0))
    .call(g => g.select('.domain').attr('stroke', 'var(--chart-grid)'))
    .selectAll('text')
    .attr('transform', 'translate(-10,0)rotate(-45)')
    .style('text-anchor', 'end')
    .style('font-size', '12px')
    .style('fill', 'var(--body-color)')

  svg.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => d3.format('$,.0f')(Number(d))))
    .call(g => g.select('.domain').attr('stroke', 'var(--chart-grid)'))
    .call(g => g.selectAll('.tick line').attr('stroke', 'var(--chart-grid)'))
    .selectAll('text')
    .style('font-size', '12px')
    .style('fill', 'var(--body-color)')

  if (props.xAxisLabel) {
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 5)
      .style('text-anchor', 'middle')
      .style('fill', 'var(--body-color)')
      .text(props.xAxisLabel)
  }

  if (props.yAxisLabel) {
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -margin.left + 15)
      .attr('x', -height / 2)
      .style('text-anchor', 'middle')
      .style('fill', 'var(--body-color)')
      .text(props.yAxisLabel)
  }

  svg.append('g')
    .attr('class', 'grid')
    .call(
      d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width)
        .tickFormat(() => '')
    )
    .call(g => g.selectAll('.tick line')
      .attr('stroke', 'var(--chart-grid)')
      .attr('stroke-opacity', 0.5)
      .attr('stroke-dasharray', '3,3'))
    .call(g => g.select('.domain').remove())

  const path = svg.append('path')
    .datum(props.data)
    .attr('fill', 'none')
    .attr('stroke', 'var(--primary)')
    .attr('stroke-width', 2)
    .attr('d', line)

  if (props.animate) {
    const pathLength = path.node()?.getTotalLength() || 0
    
    path
      .attr('stroke-dasharray', pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(1500)
      .attr('stroke-dashoffset', 0)
  }

  svg.selectAll('.dot')
    .data(props.data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => (x(d.x) as number) + x.bandwidth() / 2)
    .attr('cy', d => y(d.y))
    .attr('r', 4)
    .attr('fill', 'var(--primary)')
    .style('opacity', 0)
    .transition()
    .delay((_, i) => props.animate ? i * 100 : 0)
    .duration(500)
    .style('opacity', 1)

  const tooltip = d3.select(chartRef.value)
    .append('div')
    .attr('class', 'chart-tooltip')
    .style('opacity', 0)
    .style('position', 'absolute')
    .style('background-color', 'var(--chart-tooltip-bg)')
    .style('color', 'var(--chart-tooltip-color)')
    .style('padding', '8px')
    .style('border-radius', '4px')
    .style('pointer-events', 'none')
    .style('font-size', '12px')
    .style('z-index', '10')

  svg.selectAll<SVGCircleElement, ChartData>('circle')
    .on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 6)

      tooltip
        .style('opacity', 1)
        .html(`${d.x}: $${d.y.toLocaleString()}`)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 28}px`)
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 4)

      tooltip
        .style('opacity', 0)
    })
}

onMounted(async () => {
  await nextTick()
  renderChart()
})

watch(() => props.data, renderChart, { deep: true })

watch(() => themeStore.currentTheme, async () => {
  await nextTick()
  renderChart()
})

window.addEventListener('resize', () => {
  renderChart()
})
</script>

<template>
  <div class="chart-container">
    <div class="chart-header">
      <h5>{{ title }}</h5>
    </div>
    <div class="chart-body">
      <div ref="chartRef" class="chart"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chart {
  width: 100%;
  min-height: 300px;
  
  :deep(.domain) {
    stroke: var(--chart-grid);
  }
  
  :deep(.tick line) {
    stroke: var(--chart-grid);
  }
  
  :deep(.grid line) {
    stroke: var(--chart-grid);
    stroke-opacity: 0.3;
  }
}
</style>