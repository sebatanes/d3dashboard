<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import { useThemeStore } from '../../stores/theme'

const props = defineProps<{
  data: { label: string, value: number }[];
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  color?: string;
  animate?: boolean;
  height?: number;
}>()

const chartRef = ref<HTMLDivElement | null>(null)
const themeStore = useThemeStore()

const renderChart = async () => {
  if (!chartRef.value || props.data.length === 0) return
  
  d3.select(chartRef.value).selectAll('*').remove()
  
  const margin = { top: 30, right: 30, bottom: 60, left: 80 }
  const width = chartRef.value.clientWidth - margin.left - margin.right
  const height = (props.height || 300) - margin.top - margin.bottom
  
  const svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
  
  const x = d3.scaleBand()
    .domain(props.data.map(d => d.label))
    .range([0, width])
    .padding(0.2)
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(props.data, d => d.value) as number * 1.1])
    .range([height, 0])
  
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
  
  const bars = svg.selectAll('rect')
    .data(props.data)
    .enter()
    .append('rect')
    .attr('x', d => x(d.label) as number)
    .attr('y', height)
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .attr('fill', props.color || 'var(--secondary)')
    .attr('rx', 2)
    .attr('ry', 2)
  
  if (props.animate) {
    bars.transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value))
  } else {
    bars
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value))
  }
  
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
  
  bars
    .on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('fill', d3.rgb(props.color || 'var(--secondary)').darker(0.2).toString())
      
      tooltip
        .style('opacity', 1)
        .html(`${d.label}: $${d.value.toLocaleString()}`)
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY - 28}px`)
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('fill', props.color || 'var(--secondary)')
      
      tooltip
        .style('opacity', 0)
    })
  
  svg.selectAll('.bar-value')
    .data(props.data)
    .enter()
    .append('text')
    .attr('class', 'bar-value')
    .attr('x', d => (x(d.label) as number) + x.bandwidth() / 2)
    .attr('y', d => y(d.value) - 5)
    .attr('text-anchor', 'middle')
    .style('font-size', '11px')
    .style('fill', 'var(--body-color)')
    .style('opacity', 0)
    .text(d => `$${d.value.toLocaleString()}`)
    .transition()
    .delay((_, i) => props.animate ? 800 + i * 100 : 0)
    .duration(500)
    .style('opacity', 1)
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
}
</style>