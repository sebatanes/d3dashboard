<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import { useThemeStore } from '../../stores/theme'

const props = withDefaults(defineProps<{
  data: { label: string, value: number }[];
  title: string;
  colors?: string[];
  animate?: boolean;
  height?: number;
}>(), {
  colors: () => [
    '#0D6EFD', '#20C997', '#FD7E14', '#198754', '#FFC107', 
    '#DC3545', '#0DCAF0', '#6610F2', '#6F42C1', '#D63384'
  ],
  animate: true,
  height: 300
})

const chartRef = ref<HTMLDivElement | null>(null)
const themeStore = useThemeStore()

const renderChart = async () => {
  if (!chartRef.value || props.data.length === 0) return
  
  d3.select(chartRef.value).selectAll('*').remove()
  
  const width = chartRef.value.clientWidth
  const radius = Math.min(width, props.height) / 2 * 0.8
  
  const svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', width)
    .attr('height', props.height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${props.height / 2})`)
  
  const color = d3.scaleOrdinal()
    .domain(props.data.map(d => d.label))
    .range(props.colors)
  
  const pie = d3.pie<{label: string, value: number}>()
    .value(d => d.value)
    .sort(null)
  
  const data_ready = pie(props.data)
  
  const arc = d3.arc<d3.PieArcDatum<{label: string, value: number}>>()
    .innerRadius(0)
    .outerRadius(radius)
  
  const labelArc = d3.arc<d3.PieArcDatum<{label: string, value: number}>>()
    .innerRadius(radius * 1.1)
    .outerRadius(radius * 1.1)
  
  const arcs = svg.selectAll('path')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.label) as string)
    .attr('stroke', 'var(--card-bg)')
    .style('stroke-width', '2px')
    .style('opacity', 0.8)
    .on('mouseover', function(d) {
      d3.select(this)
        .transition()
        .duration(200)
        .style('opacity', 1)
        .attr('transform', function() {
          const centroid = arc.centroid(d)
          return `translate(${centroid[0] * 0.1}, ${centroid[1] * 0.1})`
        })
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .style('opacity', 0.8)
        .attr('transform', 'translate(0, 0)')
    })
  
  if (props.animate) {
    arcs
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d)
        return function(t: number) {
          return arc(interpolate(t)) || ''
        }
      })
  }
  
  const labels = svg.selectAll('text')
    .data(data_ready)
    .enter()
    .append('text')
    .attr('transform', d => {
      const pos = labelArc.centroid(d)
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = radius * 0.7 * (midangle < Math.PI ? 1 : -1)
      return `translate(${pos})`
    })
    .style('text-anchor', d => {
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return midangle < Math.PI ? 'start' : 'end'
    })
    .style('font-size', '12px')
    .style('fill', 'var(--body-color)')
    .style('opacity', props.animate ? 0 : 1)
  
  labels.append('tspan')
    .attr('x', 0)
    .attr('dy', '0em')
    .text(d => d.data.label)
  
  labels.append('tspan')
    .attr('x', 0)
    .attr('dy', '1.2em')
    .text(d => `$${d.data.value.toLocaleString()}`)
  
  svg.selectAll('polyline')
    .data(data_ready)
    .enter()
    .append('polyline')
    .attr('points', d => {
      const pos = labelArc.centroid(d)
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = radius * 0.7 * (midangle < Math.PI ? 1 : -1)
      const arc_pos = arc.centroid(d)
      return `${arc_pos[0]},${arc_pos[1]} ${labelArc.centroid(d)[0]},${labelArc.centroid(d)[1]} ${pos[0]},${pos[1]}`
    })
    .style('fill', 'none')
    .style('stroke', 'var(--body-color)')
    .style('stroke-width', '1px')
    .style('opacity', props.animate ? 0 : 0.5)
  
  const legendSize = 15
  const legendSpacing = 25
  const legendX = -width / 2 + 20
  const legendY = props.height / 2 - 30
  
  const legend = svg.selectAll('.legend')
    .data(props.data)
    .enter()
    .append('g')
    .attr('class', 'legend')
    .attr('transform', (_, i) => `translate(${legendX}, ${legendY - i * legendSpacing})`)
  
  legend.append('rect')
    .attr('width', legendSize)
    .attr('height', legendSize)
    .style('fill', d => color(d.label) as string)
    .style('opacity', 0.8)
  
  legend.append('text')
    .attr('x', legendSize + 8)
    .attr('y', legendSize - 3)
    .text(d => d.label)
    .style('font-size', '12px')
    .style('fill', 'var(--body-color)')
  
  if (props.animate) {
    labels
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1)
    
    svg.selectAll('polyline')
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 0.5)
  }
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