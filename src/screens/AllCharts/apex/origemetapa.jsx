import React from 'react'
import ReactApexChart from 'react-apexcharts'
import getChartColorsArray from '../../../components/Common/ChartsDynamicColor'

const OrigemEtapa = ({ dataColors, steps = [] }) => {
  const apaexlineColumnColors = getChartColorsArray(dataColors)

  const series = steps.map((s) => ({
    name: s.origin,
    data: Object.values(s.steps || {}),
  }))

  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    colors: apaexlineColumnColors,
    xaxis: {
      categories: steps.length > 0 ? Object.keys(steps[0]?.steps || {}) : [],
    },
    yaxis: {
      title: {
        text: 'Total',
      },
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val
        },
      },
    },
  }

  return (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  )
}

export default OrigemEtapa
